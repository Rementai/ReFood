<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Shield\Authentication\Authenticators\AccessTokens;
use CodeIgniter\Shield\Authentication\Authenticators\Session;
use CodeIgniter\Shield\Authentication\Authenticators\JWT;

class Auth extends BaseConfig
{
    /**
     * Authentication methods available in the application.
     */
    public array $authenticators = [
        'tokens'  => AccessTokens::class,
        'session' => Session::class,
        'jwt'     => JWT::class,
    ];

    /**
     * The authentication chain determines the order of authenticators
     * to check when attempting to validate a user during a request.
     */
    public array $authenticationChain = [
        'session',
        'tokens',
        'jwt',
    ];

    /**
     * Settings for session-based authentication.
     */
    public array $sessionAuthenticator = [
        'allowRemembering' => true,
        'rememberLength'   => 30 * DAY,
    ];

    /**
     * Settings for JWT-based authentication.
     */
    public array $jwtAuthenticator = [
        // If enabled, session data will be written in the database
        'recordLoginAttempt' => self::RECORD_LOGIN_ATTEMPT_FAILURE,
        'defaultClaims' => [
            'iss' => 'http://localhost:8080',
        ],
    ];

    /**
     * Constants to control login attempt logging behavior.
     */
    public const RECORD_LOGIN_ATTEMPT_NONE    = 0; // Do not record at all
    public const RECORD_LOGIN_ATTEMPT_FAILURE = 1; // Record only failures
    public const RECORD_LOGIN_ATTEMPT_ALL     = 2; // Record all login attempts

    /**
     * Specify fields to use as valid credentials during login.
     */
    public array $validFields = [
        'email',
        'username',
    ];

    /**
     * Default user groups and permissions settings.
     */
    public array $defaultUserGroups = [];
    public array $defaultUserPermissions = [];
}

