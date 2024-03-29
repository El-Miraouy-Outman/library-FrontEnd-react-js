import Review from "../Models/Review";
import { StarReview } from "./StarReview";


export const Reviews: React.FC<{ review: Review}> = (props) => {
    
    const date = new Date(props.review.date);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;
    
    return (
        <div>
            <div className='col-sm-8 col-md-8'>
                <h5>{props.review.userEmail}</h5>
                <div className='row'>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        <StarReview rating={props.review.rating} size={16}/>
                    </div>
                </div>
                <div className='mt-2'>
                    <p>
                        {props.review.description}
                    </p>
                </div>
            </div>
            <hr/>
        </div>
    );
}