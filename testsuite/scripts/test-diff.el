;;;
;;; Tools for working with Jest tests in Emacs.
;;;
;;;
;;; Copyright (c) 2024 The MathJax Consortium

(require 'ediff)

;;; Jest Tests
;;; ==========
;;;
;;; Run by piping stdout and stderr into a file. Then use the output file form
;;; the stderr pipe to replace expected for actual
;;;
;;; If piping stderr only the output file will contain noise for tty
;;; colorization.
;;;

(defun jest-find-expected ()
  (block find-fail-block
    (let ((expected (condition-case nil
                        (search-forward "Expected value")
                      (error nil))))
      (if (null expected) 
          (let ((expected (condition-case nil
                              (search-forward "Expected:")
                            (error nil))))
            expected)
        expected))))
            
(defun jest-find-fail ()
  ;; Returns start end for actual and expected and position of fail o/w nil.
  (interactive)
  (block find-fail-block
    (let ((pos (condition-case nil
                   (search-forward "●" nil t)
                 (error nil))))
      (when (null pos)
        (return-from find-fail-block  nil))
      (let ((expected (jest-find-expected))
            (actual (condition-case nil
                        (search-forward "Received:")
                      (error nil)))
            )
        (when (or (null actual) (null expected))
          (return-from find-fail-block  nil))
        (let* ((beg1 (progn
                       (goto-char actual)
                       (search-forward "\"")
                       (backward-char)
                       (point)))
               (dummy1 (forward-sexp))
               (end1 (1- (point)))
               (fail1 (buffer-substring beg1 end1))
               (beg2 (progn
                       (goto-char expected)
                       (search-forward "\"")
                       (backward-char)
                       (point)))
               (dummy2 (forward-sexp))
               (end2 (1- (point)))
               (fail2 (buffer-substring beg2 end2)))
          (list (cons beg1 end1) (cons beg2 end2) pos (cons fail1 fail2))
          )))))


;; Automatic region ediff for failed test.
(defun jest-diff-fail ()
  (interactive)
  ;; (do* ((fail (find-fail)))
  ;;     ((null fail))
  (let ((fail (jest-find-fail)))
    (when (null fail) nil)
    (ediff-regions-internal
     (get-buffer (buffer-name)) (caar fail) (cdar fail)
     (get-buffer (buffer-name)) (caadr fail) (cdadr fail)
     nil 'ediff-regions-wordwise 'word-mode nil)))

(global-set-key [?\C-c ?\C-d] 'jest-diff-fail)

;; Separates expected and received values for all failed tests
;; into two separate buffers/files for ease of comparison.
;; Then simply run an ediff-buffers.
(defun jest-separate-fails (bufferA bufferB)
  (interactive
   (list (read-buffer "Buffer for Expected: ")
         (read-buffer "Buffer for Received: ")))
  (condition-case nil
      (search-forward "Summary of all failing tests")
    (error (beginning-of-buffer)))
  (do ((fail (jest-find-fail) (jest-find-fail)))
      ((null fail) nil)
    (print fail)
    (append-to-buffer bufferA (caadr fail) (cdadr fail))
    (with-current-buffer bufferA (insert "\n\n"))
    (append-to-buffer bufferB (caar fail) (cdar fail))
    (with-current-buffer bufferB (insert "\n\n"))
    ))

;;; Replace expected for actual
;;; Make sure that the test output is in the other window.
;;; Go to position where you want the next test inserted.
(defun jest-replace-expected-for-actual ()
  (interactive)
  (block expected-block
    (other-window 1)
    (let* ((fail (jest-find-fail))
           (actual (car (fourth fail)))
           (str (subseq actual 1))
           )
      (other-window 1)
      (insert str)
      )))
