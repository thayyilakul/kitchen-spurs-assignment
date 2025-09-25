<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $now = Carbon::now();

        $restaurants = [
        [
            "id" => 101,
            "name" => "Tandoori Treats",
            "location" => "Bangalore",
            "cuisine" => "North Indian",
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            "id" => 102,
            "name" => "Sushi Bay",
            "location" => "Mumbai",
            "cuisine" => "Japanese",
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            "id" => 103,
            "name" => "Pasta Palace",
            "location" => "Delhi",
            "cuisine" => "Italian",
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            "id" => 104,
            "name" => "Burger Hub",
            "location" => "Hyderabad",
            "cuisine" => "American",
            'created_at' => $now,
            'updated_at' => $now,
        ]
    ];

    Restaurant::insert($restaurants);

    }
}
