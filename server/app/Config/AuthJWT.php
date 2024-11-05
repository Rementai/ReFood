<?php

namespace Config;

use CodeIgniter\Shield\Config\AuthJWT as ShieldAuthJWT;

class AuthJWT extends ShieldAuthJWT
{
    public array $defaultClaims = [
        'iss' => 'http://localhost:8080', // adres twojej aplikacji
    ];

    public array $keys = [
        'default' => [
            [
                'alg' => 'HS256',
            ],
        ],
    ];
}
