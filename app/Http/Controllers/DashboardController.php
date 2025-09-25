<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function totalRestaurants(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        // Restaurants query with date filtering
        // $restaurantQuery = Restaurant::query();
        // if ($from) {
        //     $restaurantQuery->whereDate('created_at', '>=', $from);
        // }
        // if ($to) {
        //     $restaurantQuery->whereDate('created_at', '<=', $to);
        // }
        $restaurant_count = Restaurant::count();

        // Orders count with date filtering
        // $orderQuery = Order::query();
        // if ($from) {
        //     $orderQuery->whereDate('order_time', '>=', $from);
        // }
        // if ($to) {
        //     $orderQuery->whereDate('order_time', '<=', $to);
        // }
        // $order_count = $orderQuery->count();
        $order_count = $this->orderQuery($from, $to);

        // Order amount with same date filter
        // $orderAmountQuery = Order::query();
        // if ($from) {
        //     $orderAmountQuery->whereDate('order_time', '>=', $from);
        // }
        // if ($to) {
        //     $orderAmountQuery->whereDate('order_time', '<=', $to);
        // }
        // $order_amount = $orderAmountQuery->sum('order_amount');
        $order_amount = $this->orderAmountQuery($from, $to);

        return response()->json([
            'restaurant_count' => $restaurant_count,
            'order_count' => $order_count,
            'order_amount' => $order_amount,
        ]);
    }

    public function orderQuery($from, $to)
    {
        $orderQuery = Order::query();
        if ($from) {
            $orderQuery->whereDate('order_time', '>=', $from);
        }
        if ($to) {
            $orderQuery->whereDate('order_time', '<=', $to);
        }
        return $orderQuery->count();
    }

    public function orderAmountQuery($from, $to)
    {
        $orderAmountQuery = Order::query();
        if ($from) {
            $orderAmountQuery->whereDate('order_time', '>=', $from);
        }
        if ($to) {
            $orderAmountQuery->whereDate('order_time', '<=', $to);
        }
        return $orderAmountQuery->sum('order_amount');
    }
}
