# Kitchen Spurs Assignment

This is a Laravel-based web application developed for the Kitchen Spurs Assignment. It uses Laravel for the backend, MySQL for the database, and React for frontend.

To run this project locally, make sure you have PHP (>= 8.0), Composer, Node.js, npm, and MySQL installed. Once your environment is ready, follow these steps:

Clone the repository or download the project files. Open a terminal and navigate into the project directory.

Run `composer install` to install all PHP dependencies.

Create a `.env` file by copying the existing `.env.example` file.

Run `php artisan key:generate` to generate the application encryption key and set it in your `.env` file.

Make sure MySQL is running and create a new database for the project. Then open the `.env` file and update the database configuration values (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) to match your local setup.

Run `php artisan migrate` to create the necessary tables in your database.

Run `php artisan db:seed` to populate the database with sample data.

Run `npm install` to install the JavaScript and CSS dependencies.

Run `npm run dev` to compile the front-end assets for development.

Finally, start the Laravel development server by running `php artisan serve`.

Once the server is running, open your browser and go to [http://127.0.0.1:8000](http://127.0.0.1:8000) to access the application.

You're all set! The project should now be up and running on your local machine.