<?php
declare(strict_types=1);

namespace Softcode\DawaAddress\Test\Unit\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Softcode\DawaAddress\Model\JsConfigProvider;
use PHPUnit\Framework\TestCase;

/**
 * Specifies the config payload handed to the frontend widget: when the feature is
 * considered enabled, and the defaults applied to street mode and debounce. Runs
 * without a Magento install by mocking ScopeConfigInterface.
 */
class JsConfigProviderTest extends TestCase
{
    /**
     * Full, valid settings; pass overrides to change one aspect per test.
     *
     * @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    private function settings(array $overrides = []): array
    {
        return array_merge([
            'softcode_dawa/general/enabled'       => true,
            'softcode_dawa/selectors/postcode'    => '#postcode',
            'softcode_dawa/selectors/city'        => '#city',
            'softcode_dawa/selectors/street'      => '#street',
            'softcode_dawa/selectors/housenumber' => '#housenumber',
        ], $overrides);
    }

    /**
     * @param array<string, mixed> $settings
     */
    private function provider(array $settings): JsConfigProvider
    {
        $scopeConfig = $this->createMock(ScopeConfigInterface::class);
        $scopeConfig->method('isSetFlag')
            ->willReturnCallback(static fn (string $path): bool => (bool)($settings[$path] ?? false));
        $scopeConfig->method('getValue')
            ->willReturnCallback(static fn (string $path) => $settings[$path] ?? null);

        return new JsConfigProvider($scopeConfig);
    }

    public function testDisabledWhenFlagIsOff(): void
    {
        // All selectors present, but the admin toggle is off.
        $config = $this->provider($this->settings(['softcode_dawa/general/enabled' => false]))
            ->getJsConfig();

        $this->assertFalse($config['enabled']);
    }

    public function testDisabledWhenASelectorIsMissing(): void
    {
        // Safety: an incomplete selector set must not activate the widget, even
        // when the admin toggle is on.
        $config = $this->provider($this->settings(['softcode_dawa/selectors/street' => '']))
            ->getJsConfig();

        $this->assertFalse($config['enabled']);
    }

    public function testEnabledAndSelectorsPassedThroughWhenFullyConfigured(): void
    {
        $config = $this->provider($this->settings())->getJsConfig();

        $this->assertTrue($config['enabled']);
        $this->assertSame('#postcode', $config['selectors']['postcode']);
        $this->assertSame('#city', $config['selectors']['city']);
        $this->assertSame('#street', $config['selectors']['street']);
        $this->assertSame('#housenumber', $config['selectors']['housenumber']);
    }

    public function testStreetModeDefaultsToCombined(): void
    {
        $config = $this->provider($this->settings())->getJsConfig();
        $this->assertSame('combined', $config['streetMode']);

        $explicit = $this->provider($this->settings(['softcode_dawa/general/street_mode' => 'separate']))
            ->getJsConfig();
        $this->assertSame('separate', $explicit['streetMode']);
    }

    public function testDebounceDefaultsTo300AndIsCastToInt(): void
    {
        $config = $this->provider($this->settings())->getJsConfig();
        $this->assertSame(300, $config['debounce']);

        $explicit = $this->provider($this->settings(['softcode_dawa/general/debounce' => '500']))
            ->getJsConfig();
        $this->assertSame(500, $explicit['debounce']);
    }
}
