import { gql } from '@apollo/client';

// logged in user mutation
export const LOGIN_USER = gql`
    mutation loginUser($email: String!: $password: String!) {
        loginUser(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    title
                    description
                    authors
                    link
                    image
                    }
                }
            }   
        }
   `

// add user mutation   
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    title
                    description
                    authors
                    link
                    image
                }
            }
        }
    }
`   
// save books mutation
export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                link
                image
                }
            }
        }   
    `

// remove book mutation
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                link
                image
                }
            }
        }
    `  