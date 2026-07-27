# Changelog

## [Unreleased]
### Added
- `Test/Unit/Model/JsConfigProviderTest.php` and
  `Test/Unit/Model/Config/Source/StreetModeTest.php` — unit tests for the config
  payload sent to the frontend (enabled only when fully configured, street-mode
  and debounce defaults) and the admin street-mode options.
### Changed
- CI now **fails** on Magento 2 coding-standard errors: removed the `|| true`
  that silently swallowed `phpcs` failures and added `-n`.

## [1.1.0]
### Fixed
- Keyboard Enter now selects the highlighted suggestion (it previously used an
  empty callback and never filled the address).
- Event handlers are cleared before re-binding on focus, so repeated focus no
  longer stacks duplicate autocomplete handlers.
### Added
- composer.json, CI, README, and an architecture diagram.
