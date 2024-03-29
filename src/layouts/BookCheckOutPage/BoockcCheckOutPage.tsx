import { useEffect, useState } from "react";
import Book from "../Models/Book";
import Review from "../Models/Review";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarReview } from "../Utils/StarReview";
import { CheckOutAndReviewBox } from "./CheckOutAndReviewBook";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

    // const { authState } = useOktaAuth();

    const [book, setBook] = useState<Book>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<Review[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
/*
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
     */
    const bookId = (window.location.pathname).split('/')[2];
    console.log(bookId);
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8085/api/books/${bookId}`;

            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('erreur dans fetch reviews book par id ');
            }

            const responseJson = await response.json();
            const loadedBook: Book = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvaible: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };
            setBook(loadedBook);
            setIsLoading(false);
            console.log(responseJson)
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);
        useEffect(() => {
            const fetchBookReviews = async () => {
                const reviewUrl: string = `http://localhost:8085/api/reviews/search/findByBookId?bookId=${bookId}`;
                const responseReviews = await fetch(reviewUrl);
                if (!responseReviews.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJsonReviews = await responseReviews.json();
                const responseData = responseJsonReviews._embedded.reviews;
                const loadedReviews: Review[] = [];
                let weightedStarReviews: number = 0;
                for (const key in responseData) {
                    loadedReviews.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        bookid: responseData[key].bookId,
                        description: responseData[key].reviewDescription,
                    });
                    weightedStarReviews = weightedStarReviews + responseData[key].rating;
                }
                if (loadedReviews) {
                    const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                    setTotalStars(Number(round));
                }
                setReviews(loadedReviews);
                setIsLoadingReview(false);
            };
            fetchBookReviews().catch((error: any) => {
                setIsLoadingReview(false);
                setHttpError(error.message);
            })
        }, []);
           /*
        useEffect(() => {
            const fetchUserReviewBook = async () => {
                if (authState && authState.isAuthenticated) {
                    const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const userReview = await fetch(url, requestOptions);
                    if (!userReview.ok) {
                        throw new Error('Something went wrong');
                    }
                    const userReviewResponseJson = await userReview.json();
                    setIsReviewLeft(userReviewResponseJson);
                }
                setIsLoadingUserReview(false);
            }
            fetchUserReviewBook().catch((error: any) => {
                setIsLoadingUserReview(false);
                setHttpError(error.message);
            })
        }, [authState]);
    
        useEffect(() => {
            const fetchUserCurrentLoansCount = async () => {
                if (authState && authState.isAuthenticated) {
                    const url = `http://localhost:8080/api/books/secure/currentloans/count`;
                    const requestOptions = {
                        method: 'GET',
                        headers: { 
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                         }
                    };
                    const currentLoansCountResponse = await fetch(url, requestOptions);
                    if (!currentLoansCountResponse.ok)  {
                        throw new Error('Something went wrong!');
                    }
                    const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                    setCurrentLoansCount(currentLoansCountResponseJson);
                }
                setIsLoadingCurrentLoansCount(false);
            }
            fetchUserCurrentLoansCount().catch((error: any) => {
                setIsLoadingCurrentLoansCount(false);
                setHttpError(error.message);
            })
        }, [authState, isCheckedOut]);
    
        useEffect(() => {
            const fetchUserCheckedOutBook = async () => {
                if (authState && authState.isAuthenticated) {
                    const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const bookCheckedOut = await fetch(url, requestOptions);
    
                    if (!bookCheckedOut.ok) {
                        throw new Error('Something went wrong!');
                    }
    
                    const bookCheckedOutResponseJson = await bookCheckedOut.json();
                    setIsCheckedOut(bookCheckedOutResponseJson);
                }
                setIsLoadingBookCheckedOut(false);
            }
            fetchUserCheckedOutBook().catch((error: any) => {
                setIsLoadingBookCheckedOut(false);
                setHttpError(error.message);
            })
        }, [authState]);
    
        if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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
    
        async function checkoutBook() {
            const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const checkoutResponse = await fetch(url, requestOptions);
            if (!checkoutResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setIsCheckedOut(true);
        }
    
        async function submitReview(starInput: number, reviewDescription: string) {
            let bookId: number = 0;
            if (book?.id) {
                bookId = book.id;
            }
    
            const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
            const url = `http://localhost:8080/api/reviews/secure`;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewRequestModel)
            };
            const returnResponse = await fetch(url, requestOptions);
            if (!returnResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setIsReviewLeft(true);
        }
        */
    if (isLoading || isLoadingReview) {
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
    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <>
                                <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                    height='349' alt='Book' />
                                <p>hihhi</p>
                            </>
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckOutAndReviewBox book={book} mobile={false} />
                    <div>
                     </div>
                      </div>
                <hr />
                      <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
                    </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                       <StarReview  rating={totalStars} size={32} />
                    </div>
                </div>
                   <CheckOutAndReviewBox book={book} mobile={true} />
                 <hr />
                 <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}