# Change Log

All notable changes to the "ez-semicolon" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.0] - 2022-8-1

### Added
- New keybinding `ctrl+alt+;` (`cmd+alt+;` on Mac) which places a semicolon in place without formatting

### Changed
- Function that formats semicolons is now a registered command
- Completely overhauled the way the semicolon formatter works: it now waits for a keybinding bound directly to the semicolon key rather than listening for each document change and acting when a semicolon was inserted
  
## [1.1.0] - 2022-7-30

### Changed
- Improving the code that checks if the user is in a `for` loop

## [1.0.0] - 2022-7-30

- Initial release

[2.0.0]: https://github.com/ribru17/ez-semicolon/compare/v1.1.0..v2.0.0
[1.1.0]: https://github.com/ribru17/ez-semicolon/compare/v1.0.0..v1.1.0
[1.0.0]: https://github.com/ribru17/ez-semicolon/compare/v1.0.0..HEAD