import { useEffect, useState } from "react";
import Book from "../Models/Book";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./Components/SearchBook";

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8085/api/books";

            let url: string = '';
            console.log(url);
            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                url = baseUrl + searchUrl;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.content;
            // console.log("-------------totllelement-------------");
            // console.log(responseJson.totalElements);
            setTotalAmountOfBooks(responseJson.totalElements);
            setTotalPages(responseJson.totalPages)
            //console.log("------------totalepage--------------");
            //console.log(responseJson.totalPages);
            // setTotalAmountOfBooks(responseJson.page.totalElements);
            //setTotalPages(responseJson.page.totalPages);
            console.log(responseData);
            const loadedBooks: Book[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvaible: responseData[key].copiesAvaible,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const searchHandleChange = () => {
        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/title?title=${search}&page=0&size=3`);
        }
    }
    const categoryField=(cat: string)=>{
         if( 
            cat.toLowerCase()==='fe' || cat.toLowerCase()==='be' ||
            cat.toLowerCase()==='data' || cat.toLowerCase()==='devops' 
         ){
            setCategorySelection(cat);
            setSearchUrl(`/category?category=${cat}&&page=0&size=${booksPerPage}`)
         }
         else{
            setCategorySelection('ALL');
            setSearchUrl('');
         }
    }
    return (
        <div className="container">
            <div>
                <div className='container'>
                    <div>
                        <div className='row mt-5'>
                            <div className='col-6'>
                                <div className='d-flex'>
                                    <input className='form-control me-2' type='search'
                                        placeholder='Search' aria-labelledby='Search'
                                        onChange={(e)=>setSearch(e.target.value)}
                                    />
                                    <button className='btn btn-outline-success'
                                      onClick={() => searchHandleChange()}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='dropdown'>
                                    <button className='btn btn-secondary dropdown-toggle' type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                        aria-expanded='false'>
                                        {categorySelection}
                                    </button>
                                    <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                        <li onClick={()=>categoryField('ALL')}>
                                            <a className='dropdown-item' href='#'>
                                                All
                                            </a>
                                        </li>
                                        <li onClick={()=>categoryField('fe')}>
                                            <a className='dropdown-item' href='#'>
                                                Front End
                                            </a>
                                        </li>
                                        <li onClick={()=>categoryField('be')}>
                                            <a className='dropdown-item' href='#'>
                                                Back End
                                            </a>
                                        </li>
                                        <li onClick={()=>categoryField('data')}>
                                            <a className='dropdown-item' href='#'>
                                                Data
                                            </a>
                                        </li>
                                        <li onClick={()=>categoryField('devops')}>
                                            <a className='dropdown-item' href='#'>
                                                DevOps
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {totalAmountOfBooks > 0 ?
                          <>
                        <div className='mt-3'>
                            <h5>Number of results:{totalAmountOfBooks} </h5>
                        </div>
                        <p>
                            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                        {books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))
                        }
                          </>
                          :
                          <div className='m-5'>
                            <h3>
                                Can't find what you are looking for?
                            </h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                                href='#'>Library Services</a>
                        </div>
                         }
                        {totalPages > 1 &&
                            <Pagination
                                currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}