<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $posts = [
        ['title' => 'Getting Started with Laravel', 'content' => 'Learn the basics of Laravel framework.'],
        ['title' => 'Understanding React Components', 'content' => 'A guide to writing clean, reusable React components.'],
        ['title' => 'Database Migrations Explained', 'content' => 'Migrations are version control for your database.'],
        ['title' => 'REST APIs in Laravel', 'content' => 'Building a RESTful API using Laravel resources.'],
        ['title' => 'Styling in React with Tailwind CSS', 'content' => 'Use Tailwind to quickly build modern UI.'],
        ['title' => 'Using Axios for HTTP Requests', 'content' => 'Axios makes it easy to handle API calls in React.'],
        ['title' => 'Blade vs React for Views', 'content' => 'When to use Blade templates and when to go with React.'],
        ['title' => 'Deploying Laravel Apps', 'content' => 'Step-by-step guide to deploy Laravel on shared hosting.'],
        ['title' => 'Laravel Validation Tips', 'content' => 'Common validation techniques in Laravel.'],
        ['title' => 'React useEffect Simplified', 'content' => 'Master useEffect and avoid common pitfalls.'],
    ];

    foreach ($posts as $post) {
        Post::create($post);
    }
}
}
