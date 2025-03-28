import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Getting access to appwrite functionality

const client = new Client();
client.setEndpoint(`https://cloud.appwrite.io/v1`);
client.setProject(PROJECT_ID);

const database = new Databases(client)

//implementing the functions that will track the searches made by different users.
export const updateSearchCount = async (searchTerm, movie) => {
  //1. use appwrite sdk to check if the search term already exists in the database.
  try{
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)])
      //2. if the search term already exists, increment the count by 1.
    if(result.documents.length > 0){
        const doc = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,  {
            count: doc.count + 1
        });
          //2. if the search term does not exist, create a new document with the search term and set the count to 1.

    }else{
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        });
    }
  }catch(error){
    console.log(error)
  }


};
