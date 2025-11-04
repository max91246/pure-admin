<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUsers;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $user = AdminUsers::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);

        $credentials = $request->only('name', 'password');

        $token = Auth::guard('api')->attempt($credentials);
        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }


    // 登入
    public function login(Request $request)
    {
        $credentials = $request->only('name', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => '帳號或密碼錯誤'], 401);
        }

        return $this->respondWithToken($token);
    }

    // 取得使用者資訊
    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    // 登出
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => '登出成功']);
    }

    // 刷新 token
    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
    }

    // 共用回傳格式
    protected function respondWithToken($token)
    {
        return response()->json([
            'code' => 0,
            'success' => true,
            'data' => [
                'token' => $token,
                'accessToken' => $token,
                'refreshToken' => $token,
                'expires' => time() + Auth::guard('api')->factory()->getTTL() * 60 * 60,
                'avatar' => '',
                'username' => '',
                'nickname' => '',
                'roles' => [],
                'permissions' => [],
                'expires_in' => time() + Auth::guard('api')->factory()->getTTL() * 60 * 60
            ]
        ]);
    }
}
