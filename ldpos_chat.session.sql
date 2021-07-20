SELECT
  *
FROM
  `usersChannels`
  LEFT JOIN `users` ON `usersChannels`.`userId` = `users`.`id`
  LEFT JOIN `channels` ON `usersChannels`.`channelId` = `channels`.`id`
  INNER JOIN `messages` ON `messages`.`channelId` = `channels`.`id`
WHERE
  `userId` = '4049da4b-f033-4963-8911-f11e8f757ccd'
