use SVS

db.createUser({
  user: 'admin',
  pwd: 'P@ssw0rd',
  roles: [
    {
      role: 'readWrite',
      db: 'SVS',
    },
  ],
})

db.Campaign.insertMany([
  {
    _id: ObjectId('646266ce5e19a52987da819f'),
    name: 'Strongest Kung-fu',
    desc: 'What is the strongest Kung-fu in the world?',
    startTime: new Date('2023-05-01T16:00:00Z'),
    endTime: new Date('2023-06-15T15:59:00Z'),
    totalVote: 0,
    createdAt: new Date('2023-05-15T17:07:25.045Z'),
    updatedAt: new Date('2023-05-15T17:07:25.045Z'),
    choices: [
      {
        name: 'Taekwondo',
        id: 'eb8789fe-b2ca-4f89-a6ca-f07dce92c672',
        count: 0,
      },
      {
        name: 'Kendo',
        id: 'cd58eb3b-61ea-4675-80b6-f756568a2e09',
        count: 0,
      },
      {
        name: 'Boxing',
        id: 'c5aa57a4-4654-41b2-83c9-d7c43c2ee0b4',
        count: 0,
      },
      {
        name: 'Judo',
        id: '6f648314-e4ce-4395-a758-0f280bb61601',
        count: 0,
      },
      {
        name: 'Karate',
        id: '1494b967-89ad-48b5-a8ad-54c2c7a26b09',
        count: 0,
      },
    ],
  },
  {
    _id: ObjectId('64622f7186a2e8ceaf0b4e07'),
    name: 'Best NBA player',
    desc: 'Who is the best NBA player in history',
    startTime: new Date('2023-05-01T16:00:00Z'),
    endTime: new Date('2023-07-15T15:59:00Z'),
    totalVote: 0,
    createdAt: new Date('2023-05-15T17:07:25.045Z'),
    updatedAt: new Date('2023-05-15T17:07:25.045Z'),
    choices: [
      {
        id: '5f4f1728-ce01-45c8-8bcb-43f0cb947ffa',
        name: ' Michael Jordan',
        count: 0,
      },
      {
        id: 'f1a623db-9c7a-49ef-823e-2d8b04541dba',
        name: 'Kobe Bryant',
        count: 0,
      },
      {
        id: '22fef14a-50ff-4859-b454-56822abfde44',
        name: 'Leborn James',
        count: 0,
      },
      {
        id: 'eab438fa-3ab8-464e-ab3c-308881e8194a',
        name: 'Stephen Curry',
        count: 0,
      },
    ],
  },
  {
    _id: ObjectId('64622f7f86a2e8ceaf0b4e08'),
    name: 'HK CEO',
    desc: 'Which HK CEO candidate you are preferred.',
    startTime: new Date('2016-05-01T16:00:00Z'),
    endTime: new Date('2016-07-15T15:59:00Z'),
    totalVote: 0,
    createdAt: new Date('2023-05-15T17:07:25.045Z'),
    updatedAt: new Date('2023-05-15T17:07:25.045Z'),
    choices: [
      {
        id: '912c12c8-5bd4-4e0a-a99f-2a7620ef42e2',
        name: 'Carrie Lam',
        count: 0,
      },
      {
        id: 'dce52528-5c31-4cbe-98d5-d9d39315ae89',
        name: 'John Tsang',
        count: 0,
      },
      {
        id: '4f4b8cf2-4dcb-494c-b895-d5d5a763812f',
        name: 'Rebecca Ip',
        count: 0,
      },
    ],
  },
])

db.Vote.createIndex({'campaign': 1,'hkid': 1},{
  name: 'Vote-campaignId-hkid-unique',
  unique: true
})