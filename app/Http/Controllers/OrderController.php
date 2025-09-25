<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $sortField = $request->query('sortField', 'created_at');
        $sortDirection = $request->query('sortDirection', 'desc');
        $perPage = $request->query('perPage', 10);
        $searchTerm = $request->query('search');

        $fromDate = $request->query('from');
        $toDate = $request->query('to');
        $minAmount = $request->query('minAmount');
        $maxAmount = $request->query('maxAmount');
        $fromHour = $request->query('fromHour');
        $toHour = $request->query('toHour');
        $restaurantId = $request->query('restaurant_id');

        $allowedSortFields = ['id', 'order_amount', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }

        $query = Order::with('restaurant')->latest('order_time');

        if ($restaurantId) {
            $query->where('restaurant_id', $restaurantId);
        }
        if ($fromDate) {
            $query->whereDate('order_time', '>=', $fromDate);
        }
        if ($toDate) {
            $query->whereDate('order_time', '<=', $toDate);
        }
        if ($minAmount !== null) {
            $query->where('order_amount', '>=', $minAmount);
        }
        if ($maxAmount !== null) {
            $query->where('order_amount', '<=', $maxAmount);
        }
        if ($fromHour !== null) {
            $query->whereTime('order_time', '>=', sprintf('%02d:00:00', $fromHour));
        }
        if ($toHour !== null) {
            $query->whereTime('order_time', '<=', sprintf('%02d:59:59', $toHour));
        }
        if ($searchTerm) {
            $query->whereHas('restaurant', function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%');
            });
        }

        $aggregateQuery = clone $query;

        $totalOrders = $aggregateQuery->count();

        $totalRevenue = $aggregateQuery->sum('order_amount');

        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $peakOrderHourData = $aggregateQuery
            ->selectRaw('HOUR(order_time) as order_hour, COUNT(*) as order_count')
            ->groupBy('order_hour')
            ->orderByDesc('order_count')
            ->first();

        $peakOrderHour = $peakOrderHourData ? $peakOrderHourData->order_hour : null;

        $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        $orders = $query->paginate($perPage);

        return response()->json([
            'data' => $orders->items(),
            'last_page' => $orders->lastPage(),
            'total_orders' => $totalOrders,
            'total_revenue' => (float)$totalRevenue,
            'average_order_value' => (float)round($averageOrderValue, 2),
            'peak_order_hour' => $peakOrderHour,
        ]);
    }
}
