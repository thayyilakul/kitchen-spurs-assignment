<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $sortField = $request->query('sortField', 'created_at');
        $sortDirection = $request->query('sortDirection', 'desc');

        $from = $request->query('from');
        $to = $request->query('to');

        $query = Restaurant::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('cuisine', 'like', "%{$search}%");
            });
        }

        $query->withSum(['orders as orders_sum_order_amount' => function ($q) use ($from, $to) {
            if ($from) $q->whereDate('order_time', '>=', $from);
            if ($to) $q->whereDate('order_time', '<=', $to);
        }], 'order_amount');

        $query->withCount(['orders as orders_count' => function ($q) use ($from, $to) {
            if ($from) $q->whereDate('order_time', '>=', $from);
            if ($to) $q->whereDate('order_time', '<=', $to);
        }]);

        // Define allowed sort fields including aggregates
        $allowedSortFields = ['id', 'name', 'location', 'cuisine', 'created_at', 'orders_sum_order_amount', 'orders_count'];

        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }

        if (in_array($sortField, ['orders_sum_order_amount', 'orders_count'])) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        return $query->get();
    }

    public function show(Request $request, $id)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $perPage = 10;

        $restaurant_name = Restaurant::where('id', $id)->value('name');

        $orderQuery = Order::query()
            ->where('restaurant_id', $id);

        if ($from) {
            $orderQuery->whereDate('order_time', '>=', $from);
        }

        if ($to) {
            $orderQuery->whereDate('order_time', '<=', $to);
        }

        $order_count = $orderQuery->count();
        $order_amount = $orderQuery->sum('order_amount');
        $order_avg_amount = $orderQuery->avg('order_amount');

        $peakHourData = (clone $orderQuery)
            ->selectRaw('HOUR(order_time) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderByDesc('count')
            ->first();

        $peak_order_hour = $peakHourData ? sprintf('%02d:00', $peakHourData->hour) : null;

        $orders = (clone $orderQuery)
            ->orderByDesc('order_time')
            ->paginate($perPage);

        return response()->json([
            'restaurant_name' => $restaurant_name,
            'order_count' => $order_count,
            'order_amount' => (float)$order_amount,
            'order_avg_amount' => (float)$order_avg_amount,
            'peak_order_hour' => $peak_order_hour,
            'orders' => $orders,
        ]);
    }
}
