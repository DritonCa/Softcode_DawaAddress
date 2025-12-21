<?php
namespace Softcode\DawaAddress\Block\Checkout;

use Magento\Framework\View\Element\Template;
use Softcode\DawaAddress\Model\JsConfigProvider;

class Init extends Template
{
    public function __construct(
        Template\Context $context,
        private JsConfigProvider $configProvider,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function getJsConfig(): array
    {
        return $this->configProvider->getJsConfig();
    }
}
