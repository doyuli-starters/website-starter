CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`name` varchar(255),
	`role` varchar(32) NOT NULL DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
