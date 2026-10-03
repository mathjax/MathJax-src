#!/usr/bin/env bash

# Check English locale changes against Crowdin translations.
#
# Usage:
#   ./crowdin-check.sh [git-ref]
#
# Examples:
#   ./crowdin-check.sh
#   ./crowdin-check.sh origin/master
#
# Environment:
#   CROWDIN_PROJECT_ID       Required
#   CROWDIN_PERSONAL_TOKEN   Required
#
#   CROWDIN_LANGUAGES        Optional. Maps Crowdin language IDs to local
#                            two-letter filenames:
#
#     CROWDIN_LANGUAGES="es-ES:es fr-FR:fr de:de"
#
#   If not supplied, the script attempts to obtain the target-language IDs
#   from `crowdin language list --output json`, but it cannot reliably infer
#   custom local filename mappings. In that case, the Crowdin language ID is
#   also assumed to be the local two-letter code.
#
# Requirements:
#   bash, curl, jq, git, Crowdin CLI 5.x
#
# The script assumes locale JSON files are flat objects:
#
#   {
#     "messageKey": "English text",
#     "anotherKey": "Another message"
#   }
#
# It does NOT modify any files.

set -euo pipefail

###############################################################################
# Configuration
###############################################################################

PROJECT_ID="${CROWDIN_PROJECT_ID:-}"
TOKEN="${CROWDIN_PERSONAL_TOKEN:-}"

BASE_REF="origin/develop"

API_BASE="${CROWDIN_API_BASE:-https://api.crowdin.com/api/v2}"

# Example:
#   CROWDIN_LANGUAGES="es-ES:es fr-FR:fr de:de"
#
# The left side is the Crowdin language ID.
# The right side is the local filename code.
LANGUAGE_MAP="${CROWDIN_LANGUAGES:-}"

TMP_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

###############################################################################
# Checks
###############################################################################

die() {
    echo "ERROR: $*" >&2
    exit 1
}

command -v curl >/dev/null 2>&1 || die "curl is required"
command -v jq >/dev/null 2>&1 || die "jq is required"
command -v git >/dev/null 2>&1 || die "git is required"

[[ -n "$PROJECT_ID" ]] || die "CROWDIN_PROJECT_ID is not set"
[[ -n "$TOKEN" ]] || die "CROWDIN_PERSONAL_TOKEN is not set"

git rev-parse --show-toplevel >/dev/null 2>&1 \
    || die "This script must be run inside a Git repository"

###############################################################################
# API helper
###############################################################################

api_get() {
    local url="$1"
    local output
    local http_code

    output="$TMP_DIR/api-response.json"

    http_code="$(
        curl -sS \
            -o "$output" \
            -w '%{http_code}' \
            -H "Authorization: Bearer $TOKEN" \
            -H "Accept: application/json" \
            "$url"
    )"

    if [[ "$http_code" != "200" ]]; then
        echo "Crowdin API request failed: HTTP $http_code" >&2
        echo "URL: $url" >&2
        cat "$output" >&2
        return 1
    fi

    cat "$output"
}

###############################################################################
# API pagination
###############################################################################

# Fetch all pages of a Crowdin collection.
#
# Usage:
#   api_get_all "/projects/$PROJECT_ID/files"
#
# Produces one JSON array containing all .data entries.
api_get_all() {
    local endpoint="$1"
    local offset=0
    local limit=500
    local page
    local count
    local result='[]'
    local separator='?'

    if [[ "$endpoint" == *"?"* ]]; then
        separator='&'
    fi

    while true; do
        page="$(
            api_get \
                "${API_BASE}${endpoint}${separator}limit=${limit}&offset=${offset}"
        )"

        result="$(
            jq -n \
                --argjson result "$result" \
                --argjson page "$page" \
                '$result + ($page.data // [])'
        )"

        count="$(
            jq -r '.data // [] | length' <<< "$page"
        )"

        if [[ "$count" -lt "$limit" ]]; then
            break
        fi

        offset=$((offset + limit))
    done

    printf '%s\n' "$result"
}

###############################################################################
# Find locale files
###############################################################################

echo "Git baseline: $BASE_REF"
echo

###############################################################################
# Check Git baseline
###############################################################################

git rev-parse --verify "$BASE_REF^{commit}" >/dev/null 2>&1 \
    || die "Git reference '$BASE_REF' does not exist"

###############################################################################
# Get Crowdin files
###############################################################################

echo "Loading Crowdin files..."

CROWDIN_FILES_JSON="$TMP_DIR/crowdin-files.json"

api_get_all "/projects/$PROJECT_ID/files" > "$CROWDIN_FILES_JSON"

###############################################################################
# Get English source files from Crowdin
###############################################################################

mapfile -t EN_FILES < <(
    jq -r '
        .[]
        | (.data // .)
        | select(
            (.path // "")
            | sub("^/"; "")
            | test("(^|/)__locales__/en\\.json$")
        )
        | (.path // "")
        | sub("^/"; "")
    ' "$CROWDIN_FILES_JSON" |
    sort
)

if [[ "${#EN_FILES[@]}" -eq 0 ]]; then
    die "No __locales__/en.json source files found in Crowdin"
fi

echo "Found ${#EN_FILES[@]} English source file(s) in Crowdin."

###############################################################################
# Build language mapping
###############################################################################

build_language_map() {
    local ids
    local codes
    local local_code
    local language_id
    local i

    command -v crowdin >/dev/null 2>&1 ||
        die "crowdin CLI is required"

    mapfile -t ids < <(
        crowdin language list \
            --code id \
            --output plain
    )

    mapfile -t codes < <(
        crowdin language list \
            --code two_letters_code \
            --output plain
    )

    CROWDIN_LANGUAGES=""

    for ((i=0; i<${#codes[@]}; i++)); do
        local_code="${codes[$i]}"
        language_id="${ids[$i]}"

        [[ "$local_code" == "en" ]] && continue

        # Only include languages for which a local translation exists.
        if find . \
            -type f \
            -path "*/__locales__/${local_code}.json" \
            -not -path './.git/*' \
            -print -quit |
            grep -q .
        then
            if [[ -n "$CROWDIN_LANGUAGES" ]]; then
                CROWDIN_LANGUAGES+=" "
            fi

            CROWDIN_LANGUAGES+="${language_id}:${local_code}"
        fi
    done

    export CROWDIN_LANGUAGES
}

declare -a LANG_IDS=()
declare -a LANG_CODES=()

if [[ -n "$LANGUAGE_MAP" ]]; then

    # Explicit mapping supplied by the user.
    read -ra LANGUAGE_ENTRIES <<< "$LANGUAGE_MAP"

    for entry in "${LANGUAGE_ENTRIES[@]}"; do

        if [[ "$entry" != *:* ]]; then
            die "Invalid CROWDIN_LANGUAGES entry: $entry"
        fi

        language_id="${entry%%:*}"
        local_code="${entry#*:}"

        [[ -n "$language_id" ]] || die "Empty Crowdin language ID: $entry"
        [[ -n "$local_code" ]] || die "Empty local language code: $entry"

        LANG_IDS+=("$language_id")
        LANG_CODES+=("$local_code")
    done

else

    echo "Discovering Crowdin language mappings..."

    build_language_map

    [[ -n "$CROWDIN_LANGUAGES" ]] ||
        die "Could not construct any Crowdin language mappings"

    read -ra LANGUAGE_ENTRIES <<< "$CROWDIN_LANGUAGES"

    for entry in "${LANGUAGE_ENTRIES[@]}"; do
        language_id="${entry%%:*}"
        local_code="${entry#*:}"

        LANG_IDS+=("$language_id")
        LANG_CODES+=("$local_code")
    done

fi

echo "Target languages:"
for ((i=0; i<${#LANG_IDS[@]}; i++)); do
    echo "  ${LANG_IDS[$i]} -> ${LANG_CODES[$i]}.json"
done
echo

###############################################################################
# Utility: normalise path
###############################################################################

normalise_path() {
    local path="$1"

    path="${path#./}"
    path="${path#/}"

    printf '%s\n' "$path"
}

###############################################################################
# Utility: obtain JSON from Git
###############################################################################

git_json_at_ref() {
    local ref="$1"
    local path="$2"

    if git cat-file -e "${ref}:${path}" 2>/dev/null; then
        git show "${ref}:${path}"
    else
        printf '{}\n'
    fi
}

###############################################################################
# Utility: compare two flat JSON objects
###############################################################################

# Prints:
#
#   ADDED
#   CHANGED
#   DELETED
#
# followed by key names.
#
# The current and previous JSON files are expected to be objects.

compare_json() {
    local old_file="$1"
    local new_file="$2"

    local old_keys="$TMP_DIR/old-keys.txt"
    local new_keys="$TMP_DIR/new-keys.txt"

    jq -r 'keys[]' "$old_file" | sort > "$old_keys"
    jq -r 'keys[]' "$new_file" | sort > "$new_keys"

    echo "ADDED"
    comm -13 "$old_keys" "$new_keys" | sed 's/^/  /' || true

    echo "CHANGED"

    while IFS= read -r key; do
        [[ -n "$key" ]] || continue

        old_value="$(jq -c --arg k "$key" '.[$k]' "$old_file")"
        new_value="$(jq -c --arg k "$key" '.[$k]' "$new_file")"

        if [[ "$old_value" != "$new_value" ]]; then
            echo "  $key"
        fi
    done < <(comm -12 "$old_keys" "$new_keys")

    echo "DELETED"
    comm -23 "$old_keys" "$new_keys" | sed 's/^/  /' || true
}

###############################################################################
# Find a Crowdin file ID
###############################################################################

crowdin_file_id() {
    local local_path="$1"

    local path
    path="$(normalise_path "$local_path")"

    jq -r \
        --arg path "$path" \
        '
        .[]
        | .data.path? // .path? // empty
        | sub("^/"; "")
        ' "$CROWDIN_FILES_JSON" |
        while IFS= read -r candidate; do
            if [[ "$candidate" == "$path" ]]; then
                jq -r \
                    --arg path "$path" \
                    '
                    .[]
                    | select(
                        ((.data.path? // .path? // "") | sub("^/"; "")) == $path
                      )
                    | .data.id? // .id?
                    ' "$CROWDIN_FILES_JSON"
                return
            fi
        done

    return 1
}

###############################################################################
# Get Crowdin source strings for a file
###############################################################################

get_crowdin_strings() {
    local file_id="$1"

    api_get_all \
        "/projects/$PROJECT_ID/strings?fileId=${file_id}"
}

###############################################################################
# Get Crowdin translations for a language/file
###############################################################################

get_crowdin_translations() {
    local language_id="$1"
    local file_id="$2"

    api_get_all \
        "/projects/$PROJECT_ID/languages/${language_id}/translations?fileId=${file_id}"
}

###############################################################################
# Get Crowdin file ids
###############################################################################

get_crowdin_file_id() {
    local path="$1"

    jq -r \
        --arg path "/$path" '
        .[]
        | (.data // .)
        | select(.path == $path)
        | .id
    ' "$CROWDIN_FILES_JSON" |
    head -n 1
}

###############################################################################
# Build lookup table:
#
# Crowdin source string identifier -> Crowdin string ID
#
# We use the `identifier` field from the source string because this is normally
# the JSON key for JSON source files.
###############################################################################

build_string_map() {
    local strings_json="$1"
    local output="$2"

    jq -r '
        .[]
        | .data
        | select(.identifier != null)
        | [
            .identifier,
            (.id | tostring)
          ]
        | @tsv
    ' "$strings_json" > "$output"
}

###############################################################################
# Build translation lookup:
#
# stringId -> translationId
###############################################################################

build_translation_map() {
    local translations_json="$1"
    local output="$2"

    jq -r '
        .[]
        | .data
        | select(.stringId != null)
        | [
            (.stringId | tostring),
            (.translationId | tostring)
          ]
        | @tsv
    ' "$translations_json" > "$output"
}

###############################################################################
# Main
###############################################################################

for EN_FILE in "${EN_FILES[@]}"; do

    REL_PATH="$(normalise_path "$EN_FILE")"

    echo "================================================================"
    echo "$REL_PATH"
    echo "================================================================"

    CURRENT_JSON="$TMP_DIR/current.json"
    OLD_JSON="$TMP_DIR/old.json"

    cp "$EN_FILE" "$CURRENT_JSON"
    git_json_at_ref "$BASE_REF" "$REL_PATH" > "$OLD_JSON"

    # Validate both JSON documents.
    jq empty "$CURRENT_JSON" ||
        die "$EN_FILE is not valid JSON"

    jq empty "$OLD_JSON" ||
        die "Previous version of $REL_PATH is not valid JSON"

    echo
    compare_json "$OLD_JSON" "$CURRENT_JSON"
    echo

    ###########################################################################
    # Crowdin file
    ###########################################################################

    FILE_ID="$(get_crowdin_file_id "$REL_PATH")"

    if [[ -z "$FILE_ID" || "$FILE_ID" == "null" ]]; then
        echo "WARNING: $REL_PATH is not present in Crowdin."
        echo
        continue
    fi

    echo "Crowdin file ID: $FILE_ID"
    echo

    ###########################################################################
    # Source strings
    ###########################################################################

    STRINGS_JSON="$TMP_DIR/strings.json"
    STRING_MAP="$TMP_DIR/string-map.tsv"

    echo "Loading Crowdin source strings..."

    get_crowdin_strings "$FILE_ID" > "$STRINGS_JSON"
    build_string_map "$STRINGS_JSON" "$STRING_MAP"

    ###########################################################################
    # Determine changed/current keys
    ###########################################################################

    CURRENT_KEYS="$TMP_DIR/current-keys.txt"
    ADDED_KEYS="$TMP_DIR/added-keys.txt"
    CHANGED_KEYS="$TMP_DIR/changed-keys.txt"

    jq -r 'keys[]' "$CURRENT_JSON" | sort > "$CURRENT_KEYS"

    jq -r 'keys[]' "$OLD_JSON" | sort > "$TMP_DIR/old-keys.txt"

    comm -13 "$TMP_DIR/old-keys.txt" "$CURRENT_KEYS" \
        > "$ADDED_KEYS" || true

    : > "$CHANGED_KEYS"

    while IFS= read -r key; do
        [[ -n "$key" ]] || continue

        old_value="$(jq -c --arg k "$key" '.[$k]' "$OLD_JSON")"
        new_value="$(jq -c --arg k "$key" '.[$k]' "$CURRENT_JSON")"

        if [[ "$old_value" != "$new_value" ]]; then
            echo "$key" >> "$CHANGED_KEYS"
        fi
    done < <(
        comm -12 "$TMP_DIR/old-keys.txt" "$CURRENT_KEYS"
    )

    ###########################################################################
    # Check every target language
    ###########################################################################

    for ((LANG_INDEX=0; LANG_INDEX<${#LANG_IDS[@]}; LANG_INDEX++)); do

        LANGUAGE_ID="${LANG_IDS[$LANG_INDEX]}"
        LOCAL_CODE="${LANG_CODES[$LANG_INDEX]}"

        echo
        echo "[$LOCAL_CODE] Crowdin language: $LANGUAGE_ID"

        TRANSLATIONS_JSON="$TMP_DIR/translations-${LOCAL_CODE}.json"
        TRANSLATION_MAP="$TMP_DIR/translations-${LOCAL_CODE}.tsv"

        get_crowdin_translations \
            "$LANGUAGE_ID" \
            "$FILE_ID" \
            > "$TRANSLATIONS_JSON"

        build_translation_map \
            "$TRANSLATIONS_JSON" \
            "$TRANSLATION_MAP"

        #######################################################################
        # Current untranslated messages
        #######################################################################

        echo "  UNTRANSLATED"

        found_untranslated=0

        while IFS= read -r key; do
            [[ -n "$key" ]] || continue

            string_id="$(
                awk -F '\t' -v key="$key" '$1 == key {print $2; exit}' \
                    "$STRING_MAP"
            )"

            # A current local source key that has not yet been uploaded to
            # Crowdin cannot have a translation there.
            if [[ -z "$string_id" ]]; then
                echo "    $key  [not yet in Crowdin]"
                found_untranslated=1
                continue
            fi

            if ! awk -F '\t' -v id="$string_id" '$1 == id {found=1} END {exit !found}' \
                "$TRANSLATION_MAP"
            then
                echo "    $key"
                found_untranslated=1
            fi

        done < "$CURRENT_KEYS"

        if [[ "$found_untranslated" -eq 0 ]]; then
            echo "    none"
        fi

        #######################################################################
        # Changed messages
        #######################################################################

        echo "  SOURCE CHANGED"

        found_changed=0

        while IFS= read -r key; do
            [[ -n "$key" ]] || continue

            string_id="$(
                awk -F '\t' -v key="$key" '$1 == key {print $2; exit}' \
                    "$STRING_MAP"
            )"

            if [[ -z "$string_id" ]]; then
                echo "    $key  [not yet in Crowdin]"
                found_changed=1
                continue
            fi

            if ! awk -F '\t' -v id="$string_id" '$1 == id {found=1} END {exit !found}' \
                "$TRANSLATION_MAP"
            then
                echo "    $key  [untranslated]"
            else
                echo "    $key  [translation exists; review]"
            fi

            found_changed=1

        done < "$CHANGED_KEYS"

        if [[ "$found_changed" -eq 0 ]]; then
            echo "    none"
        fi

        #######################################################################
        # Added messages
        #######################################################################

        echo "  SOURCE ADDED"

        found_added=0

        while IFS= read -r key; do
            [[ -n "$key" ]] || continue

            string_id="$(
                awk -F '\t' -v key="$key" '$1 == key {print $2; exit}' \
                    "$STRING_MAP"
            )"

            if [[ -z "$string_id" ]]; then
                echo "    $key  [not yet in Crowdin]"
            elif ! awk -F '\t' -v id="$string_id" '$1 == id {found=1} END {exit !found}' \
                "$TRANSLATION_MAP"
            then
                echo "    $key  [untranslated]"
            else
                echo "    $key  [translated]"
            fi

            found_added=1

        done < "$ADDED_KEYS"

        if [[ "$found_added" -eq 0 ]]; then
            echo "    none"
        fi

    done

    echo
done
