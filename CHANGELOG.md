# Changelog

## [Unreleased]
### Added
- **PHP unit tests now run in CI** as a real gate — a standalone `Test/bootstrap.php`
  autoloads the module and stubs the mocked Magento contracts, so
  `phpunit -c phpunit.xml.dist` runs without a Magento install.
- **JavaScript unit tests (Jest + jsdom)** for the checkout widget:
  `Test/js/dropdown.test.js` (mouse + keyboard selection, arrow navigation, hide)
  and `Test/js/dawa.test.js` (postcode→city incl. API failure, debounced
  autocomplete, ArrowUp/Down/Enter/Escape, no duplicate handlers on repeated focus).
  A new `js-tests` CI job runs them (`npm ci && npm test`).
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
