<?php
declare(strict_types=1);

namespace Softcode\DawaAddress\Test\Unit\Model\Config\Source;

use Softcode\DawaAddress\Model\Config\Source\StreetMode;
use PHPUnit\Framework\TestCase;

/**
 * The admin "street mode" dropdown must offer exactly the two values the frontend
 * understands: 'separate' and 'combined'.
 */
class StreetModeTest extends TestCase
{
    public function testOffersSeparateAndCombined(): void
    {
        $options = (new StreetMode())->toOptionArray();

        $this->assertSame(
            ['separate', 'combined'],
            array_column($options, 'value')
        );

        foreach ($options as $option) {
            $this->assertArrayHasKey('label', $option);
            $this->assertNotSame('', (string) $option['label']);
        }
    }
}
