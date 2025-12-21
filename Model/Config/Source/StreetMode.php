<?php
namespace Softcode\DawaAddress\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;

class StreetMode implements ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'separate', 'label' => __('Separate fields')],
            ['value' => 'combined', 'label' => __('Combined street + house number')]
        ];
    }
}
