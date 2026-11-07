<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::latest()->get();

        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $products,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
                'name' => ['required', 'string', 'max:255'],
                'category' => ['required', 'string', 'max:100'],
                'price' => ['required', 'numeric', 'min:0'],
                'stock' => ['required', 'integer', 'min:0'],
            ]);
        } catch (ValidationException $e) {
            Log::warning('Product creation validation failed', [
                'actor' => $request->user()?->id ?? 'guest',
                'ip_address' => $request->ip(),
                'action' => 'store_product_validation',
                'failed_fields' => array_keys($e->validator->failed()),
                'reason' => 'Request payload failed validation rules on fields: ' . implode(', ', array_keys($e->validator->failed())),
            ]);

            throw $e;
        }

        $product = Product::create($validated);

        Log::info('Product successfully created', [
            'actor' => $request->user()?->id ?? 'system',
            'ip_address' => $request->ip(),
            'action' => 'store_product',
            'resource' => 'products',
            'resource_id' => $product->id,
            'product_sku' => $product->sku,
            'product_name' => $product->name,
            'reason' => 'User submitted valid payload to create a new product',
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => $product,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $validated = $request->validate([
                'sku' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('products', 'sku')->ignore($product->id)],
                'name' => ['sometimes', 'required', 'string', 'max:255'],
                'category' => ['sometimes', 'required', 'string', 'max:100'],
                'price' => ['sometimes', 'required', 'numeric', 'min:0'],
                'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            ]);
        } catch (ValidationException $e) {
            Log::warning('Product update validation failed', [
                'actor' => $request->user()?->id ?? 'guest',
                'ip_address' => $request->ip(),
                'action' => 'update_product_validation',
                'resource_id' => $product->id,
                'failed_fields' => array_keys($e->validator->failed()),
                'reason' => 'Update payload failed validation rules on fields: ' . implode(', ', array_keys($e->validator->failed())),
            ]);

            throw $e;
        }

        $product->update($validated);

        Log::info('Product successfully updated', [
            'actor' => $request->user()?->id ?? 'system',
            'ip_address' => $request->ip(),
            'action' => 'update_product',
            'resource' => 'products',
            'resource_id' => $product->id,
            'product_sku' => $product->sku,
            'reason' => 'User submitted valid payload to update product',
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $productId = $product->id;
        $productSku = $product->sku;

        $product->delete();

        Log::info('Product successfully deleted', [
            'actor' => request()->user()?->id ?? 'system',
            'ip_address' => request()->ip(),
            'action' => 'delete_product',
            'resource' => 'products',
            'resource_id' => $productId,
            'product_sku' => $productSku,
            'reason' => 'User requested product removal',
        ]);

        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }
}
