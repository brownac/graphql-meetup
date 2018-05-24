import Users from './data/users'
import Skills from './data/skills'
import find from 'lodash/find'
import filter from 'lodash/filter'
import sumBy from 'lodash/sumBy'

import {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLInt)},
    first_name: {type: new GraphQLNonNull(GraphQLString)},
    last_name: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: new GraphQLNonNull(GraphQLInt)},
    employer: {type: new GraphQLNonNull(GraphQLString)},
    skills: {
      type: new GraphQLList(SkillsType),
      resolve: (user, args) => {
        return filter(Skills, skill => skill.userId === user.id)
      }
    },
    // what if we want to add up our skills? let's do that here
  })
})

const SkillsType = new GraphQLObjectType({
  name: 'Skills',
  description: 'Mad skillz',
  fields: () => ({
    userId: {type: new GraphQLNonNull(GraphQLInt)},
    id: {type: new GraphQLNonNull(GraphQLInt)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    type: {type: new GraphQLNonNull(GraphQLString)},
    user: {
      type: UserType,
      resolve: (skill) => {
        return find(Users, user => user.id === skill.userId)
      }
    }
  })
})

const QueryRootType = new GraphQLObjectType({
  name: 'QuerySchema',
  description: 'Root schema',
  fields: () => ({
    users: {
      args: {
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        age: {type: GraphQLInt},
        employer: {type: GraphQLString}
      },
      type: new GraphQLList(UserType),
      description: 'List of Users',
      resolve: (parent, args) => {
        if (Object.keys(args).length) {
          return filter(Users, args)
        }
        return Users
      }
    },
    skills: {
      args: {
        userId: {type: GraphQLInt},
        name: {type: GraphQLString},
        type: {type: GraphQLString}
      },
      type: new GraphQLList(SkillsType),
      description: 'List of skills',
      resolve: (parent, args) => {
        if (Object.keys(args).length) {
          return filter(Skills, args)
        }
        return Skills
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: QueryRootType
})

export default schema
