(require 'ediff)

(defun find-fail ()
  ;; Returns start end for actual and expected and position of fail o/w nil.
  (interactive)
  (block find-fail-block
    (let ((pos (condition-case nil
                   (search-forward "FAIL" nil t)
                 (error nil))))
      (when (null pos)
        (return-from find-fail-block  nil))
      (let ((actual (condition-case nil
                        (search-forward "Actual:")
                      (error nil)))
            (expected (condition-case nil
                          (search-forward "Expected:")
                        (error nil))))
        (when (or (null actual) (null expected))
          (return-from find-fail-block  nil))
        (let* ((beg1 (progn
                       (goto-char actual)
                       (forward-line)
                       (line-beginning-position)))
               (end1 (line-end-position))
               (fail1 (buffer-substring beg1 end1))
               (beg2 (progn
                       (goto-char expected)
                       (forward-line)
                       (line-beginning-position)))
               (end2 (line-end-position))
               (fail2 (buffer-substring beg2 end2)))
          (cons fail1 fail2)
          (list (cons beg1 end1) (cons beg2 end2) pos)
          )))))


(defun diff-fail ()
  (interactive)
  ;; (do* ((fail (find-fail)))
  ;;     ((null fail))
  (let ((fail (find-fail)))
    (when (null fail) nil)
    (ediff-regions-internal
     (get-buffer (buffer-name)) (caar fail) (cdar fail)
     (get-buffer (buffer-name)) (caadr fail) (cdadr fail)
     nil 'ediff-regions-wordwise 'word-mode nil)))

(global-set-key [?\C-c ?\C-d] 'diff-fail)

;;; Replace expected for actual

(defun replace-expected-for-actual ()
  (interactive)
  (block expected-block
    (let ((actual (get-actual-for-fail)))
      (forward-line)
      (other-window 1)
      (beginning-of-buffer)
      (let ((pos (condition-case nil
                     (search-forward (concat "'" (car actual) "'"))
                   (error nil))))
        (when (null pos)
          (return-from expected-block nil))
        (let ((old (condition-case nil
                       (search-forward "\"math\"")
                     (error nil))))
          (when (null old)
            (return-from expected-block nil))
          (beginning-of-line)
          (kill-sexp)
          (insert (cadr actual))
          (other-window 1)
          t
          )))))

(defun get-actual-for-fail ()
  (block fail-block
    (let ((fail (find-fail)))
      (when (null fail) (return-from fail-block nil))
      (let* ((point1 (progn
                       (goto-char (third fail))
                       (beginning-of-line)
                       (condition-case nil
                           (search-forward "test")
                         (error nil))
                       (forward-char 1)
                       (point)))
             (point2 (progn
                       (condition-case nil
                           (search-forward "\t")
                         (error nil))
                       (point)))
             (name (buffer-substring point1 (1- point2))
                   )
             (actual (buffer-substring (caar fail) (cdar fail))))
        (list name actual)))))

;; Finding all fails

(defun get-file-name ()
  (search-backward "Running tests from ")
  (forward-char 19)
  (let ((start (point))
        (end (progn (forward-sexp)
                    (point))))
    (buffer-substring start end)))

(defun find-all-fail ()
  (beginning-of-buffer)
  (do* ((fail (find-fail) (find-fail))
        (fails ()))
      ((null fail) (reverse fails))
    (push (cons (get-file-name) fail) fails)
    (goto-char (car (last fail))))
  )

(defun print-all-fail ()
  (interactive)
  (let ((all-fail (find-all-fail)))
    (dolist (x all-fail)
      (print x))
    (print (remove-duplicates (mapcar #'car all-fail) :test #'string-equal))
    ))


;;; Replacing an entire file

(defun replace-all-in-file (file diff &optional dir)
  (interactive)
  (find-file (if dir
                 (concat dir "/" file)
               file))
  (beginning-of-buffer)
  ;; find correct positon in diff file
  (search-forward "parserTest =" )
  (search-forward "()")
  (backward-sexp 2)
  (let* ((start (point))
         (end (progn (forward-sexp) (point)))
         (name (buffer-substring start end)))
    (print name)
    (find-file-other-window diff)
    (beginning-of-buffer)
    (search-forward name)
    )
  (do ()
      ((not (replace-expected-for-actual))))

  )


(defun replace-in-all-files (files diff &optional dir)
  (dolist (file files)
    (replace-all-in-file file diff dir)
    )
  )


;;; Generate basic latex tests.

(defun generate-latex-test ()
  (interactive)
  (whitespace-cleanup)
  (beginning-of-buffer)
  (query-replace "\\" "\\\\")
  (beginning-of-buffer)
  (while t
    (when (not (equal (line-beginning-position) (line-end-position)))
      (insert "parserTest.runTest(\n")
      (insert "  'NAME ', '")
      (move-end-of-line nil)
      (insert "',\n  {\"kind\":\"math\"}\n);")
      )
    (move-beginning-of-line nil)
    (next-line)
    ))


;;; Special function for json element rewriting.

(defun json-reformat:tree-to-string (root level)
  (let ((first t))
    (concat "{"
          (let (key val str)
            (while root
              (setq key (car root)
                    val (cadr root)
                    root (cddr root))
              (setq str
                    (concat str (if first (setq first nil)
                                  (json-reformat:indent (1+ level)))
                            "\"" key "\""
                            ": "
                            (json-reformat:print-node val (1+ level))
                            (when root ",\n")
                            )))
            str)
          "}")))

(defun json-reformat:vector-to-string (val level)
  (if (= (length val) 0) "[]"
    (concat "[\n"
            (mapconcat
             'identity
             (loop for v across val
                   collect (concat
                            (json-reformat:indent (1+ level))
                            (json-reformat:print-node v (1+ level))
                            ))
             (concat ",\n"))
            "]"
            )))

(defun json-my-reformat ()
  (interactive)
  (let ((start (point))
        (dummy (forward-sexp))
        (end (point)))
    (setq json-reformat:indent-width 2)
    (json-reformat-region start end)
    (indent-region start end)
    )
  )

(global-set-key [?\C-x ?\C-j] 'json-my-reformat)

;;; Rewriting all json elements

(defun json-reformat:complete-file ()
  (beginning-of-buffer)
  (loop
   (let ((pos (condition-case nil
                  (search-forward "\"math\",\"" nil t)
                (error nil))))
     (when (null pos)
       (return nil))
     (search-backward "{\"kind\"")
     (beginning-of-line)
     (indent-for-tab-command)
     (json-my-reformat)
     (forward-sexp)
     )))

(defun json-reformat:in-all-files (files &optional dir)
  (dolist (file files)
    (find-file (if dir
                   (concat dir "/" file)
                 file))
    (json-reformat:complete-file)
    )
  )
