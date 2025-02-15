CREATE TABLE `Language` (
  `language_code` VARCHAR(5) PRIMARY KEY,
  `language_name` VARCHAR(100) UNIQUE NOT NULL,
  `branch_id` INT UNIQUE
);

CREATE TABLE `Restaurant` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `logo` VARCHAR(512),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Restaurant_Translation` (
  `restaurant_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `language_code` VARCHAR(5),
  `description` TEXT NOT NULL,
  PRIMARY KEY (`restaurant_id`, `language_code`)
);

CREATE TABLE `Category` (
  `category_id` INT PRIMARY KEY AUTO_INCREMENT,
  `icon` VARCHAR(512) NOT NULL,
  `restaurant_id` INT,
  PRIMARY KEY (`restaurant_id`)
);

CREATE TABLE `Subcategory` (
  `subcategory_id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `language_code` VARCHAR(5),
  `translated_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`subcategory_id`, `language_code`)
);

CREATE TABLE `Category_Translation` (
  `category_id` INT,
  `language_code` VARCHAR(5),
  `translated_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`category_id`, `language_code`)
);

CREATE TABLE `Item` (
  `item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_id` INT,
  `subcategory_id` INT,
  `restaurant_id` INT,
  `image` VARCHAR(512) NOT NULL,
  `price` INT,
  `discount` INT,
  `is_hide` BOOL,
  `is_available` BOOL,
  PRIMARY KEY (`restaurant_id`)
);

CREATE TABLE `Item_Translation` (
  `item_id` INT,
  `language_code` VARCHAR(5),
  `translated_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`item_id`, `language_code`)
);

CREATE TABLE `Tag` (
  `tag_id` INT PRIMARY KEY AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `image` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`tag_id`, `item_id`)
);

CREATE TABLE `Tag_Translation` (
  `tag_id` INT,
  `language_code` VARCHAR(5),
  `translated_name` VARCHAR(255) NOT NULL,
  `translated_description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`tag_id`, `language_code`)
);

CREATE TABLE `Extra_Item` (
  `extra_item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `restaurant_id` INT NOT NULL,
  `image` VARCHAR(512) NOT NULL,
  `price` INT,
  PRIMARY KEY (`extra_item_id`, `item_id`)
);

CREATE TABLE `Extra_Item_Translation` (
  `extra_item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `language_code` VARCHAR(5) NOT NULL,
  `translated_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`extra_item_id`, `language_code`)
);

ALTER TABLE `Category` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `Restaurant` (`id`) ON DELETE CASCADE;

ALTER TABLE `Restaurant_Translation` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `Restaurant` (`id`) ON DELETE CASCADE;

ALTER TABLE `Restaurant_Translation` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`) ON DELETE CASCADE;

ALTER TABLE `Subcategory` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`) ON DELETE CASCADE;

ALTER TABLE `Category_Translation` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`) ON DELETE CASCADE;

ALTER TABLE `Category_Translation` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`) ON DELETE CASCADE;

ALTER TABLE `Subcategory` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`);

ALTER TABLE `Item` ADD FOREIGN KEY (`item_id`) REFERENCES `Restaurant` (`id`) ON DELETE CASCADE;

ALTER TABLE `Item_Translation` ADD FOREIGN KEY (`item_id`) REFERENCES `Item` (`item_id`) ON DELETE CASCADE;

ALTER TABLE `Item_Translation` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`) ON DELETE CASCADE;

ALTER TABLE `Item` ADD FOREIGN KEY (`item_id`) REFERENCES `Category` (`category_id`);

ALTER TABLE `Item` ADD FOREIGN KEY (`item_id`) REFERENCES `Subcategory` (`subcategory_id`);

ALTER TABLE `Tag` ADD FOREIGN KEY (`tag_id`) REFERENCES `Item` (`item_id`);

ALTER TABLE `Tag_Translation` ADD FOREIGN KEY (`tag_id`) REFERENCES `Tag` (`tag_id`) ON DELETE CASCADE;

ALTER TABLE `Tag_Translation` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`) ON DELETE CASCADE;

ALTER TABLE `Extra_Item` ADD FOREIGN KEY (`extra_item_id`) REFERENCES `Restaurant` (`id`) ON DELETE CASCADE;

ALTER TABLE `Extra_Item_Translation` ADD FOREIGN KEY (`extra_item_id`) REFERENCES `Extra_Item` (`extra_item_id`) ON DELETE CASCADE;

ALTER TABLE `Extra_Item_Translation` ADD FOREIGN KEY (`language_code`) REFERENCES `Language` (`language_code`) ON DELETE CASCADE;
