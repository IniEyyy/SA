CREATE DATABASE IF NOT EXISTS jomoro_product;
USE jomoro_product;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(255) NULL,
  category_id INT NOT NULL,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

INSERT INTO categories (id, name) VALUES
  (1, 'Coffee'),
  (2, 'Tea'),
  (3, 'Bakery');

INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  ('Classic Single Espresso', 'A concentrated shot of coffee brewed under pressure through finely ground beans.', 4, 100, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600', 1),
  ('Creamy House Cappuccino', 'Double espresso prepared with hot milk and a thick layer of steamed milk foam.', 5, 100, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600', 1),
  ('Smooth Vanilla Latte', 'A milk coffee made of espresso and steamed milk with a thin layer of foam.', 5, 100, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600', 1),
  ('Japanese Matcha Latte', 'High quality Japanese green tea powder whisked with velvety steamed milk.', 6, 100, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600', 2),
  ('Fresh Butter Croissant', 'A buttery and flaky French pastry baked fresh every single morning.', 4, 100, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600', 3),
  ('Rich Chocolate Muffin', 'An intensely rich chocolate muffin packed with decadent chocolate chips.', 4, 100, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600', 3);
