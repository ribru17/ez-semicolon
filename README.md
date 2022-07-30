# EZ Semicolon

## An extension that makes semicolons easy!

![preview](images/preview.gif)

## Features

* No matter where your cursor is, when you enter a semicolon it will always appear at the end of the line and (optionally) followed by a new line!
* Unlike many other extensions, EZ Semicolon has support for:
  * Multiple cursors
  * Detecting whether the user is in a `for` loop or a single line string literal

## Extension Settings

* `ez-semicolon.newline`: Whether or not to follow semicolons with a newline each time. Defaults to `true`.
* `ez-semicolon.escapeString`: Whether or not to reformat the semicolon even if the cursor is inside a string literal. Defaults to `false`.