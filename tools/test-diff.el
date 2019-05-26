(require 'ediff)

(defun find-fail ()
  (interactive)
  (let ((pos (condition-case nil
                 (search-forward "FAIL")
               (error nil))))
    (when (null pos)
      (return nil))
    (let ((actual (condition-case nil
                      (search-forward "Actual:")
                    (error nil)))
          (expected (condition-case nil
                      (search-forward "Expected:")
                      (error nil))))
      (when (or (null actual) (null expected))
        (return nil))
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
        ))))


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
  (let ((actual (get-actual-for-fail)))
    (forward-line)
    (other-window 1)
    (beginning-of-buffer)
    (let ((pos (condition-case nil
                   (search-forward (car actual))
                 (error nil))))
      (when (null pos)
        (return nil))
      (let ((old (condition-case nil
                     (search-forward "{\"kind\":\"math\"")
                   (error nil))))
        (when (null old)
          (return nil))
        (backward-char 14)
        (kill-sexp)
        (insert (cadr actual))
        (other-window 1)
  ))))

(defun get-actual-for-fail ()
  (let ((fail (find-fail)))
    (when (null fail) (return nil))
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
      (list name actual))))


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
  (print "HERE2")
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
  (print "HERE")
    (setq json-reformat:indent-width 2)
    (json-reformat-region start end)
    (indent-region start end)
    )
  )

(global-set-key [?\C-x ?\C-j] 'json-my-reformat)

