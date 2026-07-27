# Changelog

## [1.1.0]
### Fixed
- Keyboard Enter now selects the highlighted suggestion (it previously used an
  empty callback and never filled the address).
- Event handlers are cleared before re-binding on focus, so repeated focus no
  longer stacks duplicate autocomplete handlers.
### Added
- composer.json, CI, README, and an architecture diagram.
