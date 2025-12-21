<?php
namespace Softcode\DawaAddress\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class JsConfigProvider
{
    private const XML_PATH = 'softcode_dawa/';

    public function __construct(
        private ScopeConfigInterface $scopeConfig
    ) {}

    public function getJsConfig(?int $storeId = null): array
    {
        $selectors = [
            'postcode' => $this->getValue('selectors/postcode', $storeId),
            'city' => $this->getValue('selectors/city', $storeId),
            'street' => $this->getValue('selectors/street', $storeId),
            'housenumber' => $this->getValue('selectors/housenumber', $storeId),
        ];

        // If selectors are missing, disable module safely
        $enabled = $this->isEnabled($storeId)
            && !in_array('', $selectors, true);

        return [
            'enabled' => $enabled,
            'streetMode' => $this->getValue('general/street_mode', $storeId) ?: 'combined',
            'debounce' => (int)($this->getValue('general/debounce', $storeId) ?: 300),
            'selectors' => $selectors
        ];
    }

    private function isEnabled(?int $storeId): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH . 'general/enabled',
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    private function getValue(string $path, ?int $storeId)
    {
        return $this->scopeConfig->getValue(
            self::XML_PATH . $path,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }
}
