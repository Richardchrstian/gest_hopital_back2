-- CreateTable
CREATE TABLE `comptables` (
    `id_comptable` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `id_hopital` INTEGER NOT NULL,
    `profile_picture` VARCHAR(255) NULL,
    `prenom` VARCHAR(255) NULL,
    `telephone` VARCHAR(20) NULL,
    `pays_id` INTEGER NULL,
    `ville_id` INTEGER NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `comptables_pays_id_foreign_idx`(`pays_id`),
    INDEX `comptables_ville_id_foreign_idx`(`ville_id`),
    INDEX `id_hopital`(`id_hopital`),
    PRIMARY KEY (`id_comptable`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `directeurs` (
    `id_directeur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `profile_picture` VARCHAR(255) NULL,
    `prenom` VARCHAR(255) NULL,
    `telephone` VARCHAR(20) NULL,
    `pays_id` INTEGER NULL,
    `ville_id` INTEGER NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `directeurs_pays_id_foreign_idx`(`pays_id`),
    INDEX `directeurs_ville_id_foreign_idx`(`ville_id`),
    PRIMARY KEY (`id_directeur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hopitaux` (
    `id_hopital` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `profile_picture` VARCHAR(255) NULL,
    `pays_id` INTEGER NULL,
    `ville_id` INTEGER NULL,
    `registration_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `statut` ENUM('actif', 'archivé') NOT NULL DEFAULT 'actif',

    UNIQUE INDEX `email`(`email`),
    INDEX `hopitaux_pays_id_foreign_idx`(`pays_id`),
    INDEX `hopitaux_ville_id_foreign_idx`(`ville_id`),
    PRIMARY KEY (`id_hopital`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pays` (
    `id_pays` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_pays` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `nom_pays`(`nom_pays`),
    PRIMARY KEY (`id_pays`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sequelizemeta` (
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ville` (
    `id_ville` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_ville` VARCHAR(255) NOT NULL,
    `id_pays` INTEGER NOT NULL,

    INDEX `id_pays`(`id_pays`),
    PRIMARY KEY (`id_ville`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comptables` ADD CONSTRAINT `comptables_ibfk_1` FOREIGN KEY (`id_hopital`) REFERENCES `hopitaux`(`id_hopital`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comptables` ADD CONSTRAINT `comptables_pays_id_foreign_idx` FOREIGN KEY (`pays_id`) REFERENCES `pays`(`id_pays`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comptables` ADD CONSTRAINT `comptables_ville_id_foreign_idx` FOREIGN KEY (`ville_id`) REFERENCES `ville`(`id_ville`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `directeurs` ADD CONSTRAINT `directeurs_pays_id_foreign_idx` FOREIGN KEY (`pays_id`) REFERENCES `pays`(`id_pays`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `directeurs` ADD CONSTRAINT `directeurs_ville_id_foreign_idx` FOREIGN KEY (`ville_id`) REFERENCES `ville`(`id_ville`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hopitaux` ADD CONSTRAINT `hopitaux_pays_id_foreign_idx` FOREIGN KEY (`pays_id`) REFERENCES `pays`(`id_pays`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hopitaux` ADD CONSTRAINT `hopitaux_ville_id_foreign_idx` FOREIGN KEY (`ville_id`) REFERENCES `ville`(`id_ville`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ville` ADD CONSTRAINT `ville_ibfk_1` FOREIGN KEY (`id_pays`) REFERENCES `pays`(`id_pays`) ON DELETE CASCADE ON UPDATE RESTRICT;
