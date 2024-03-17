import { Link } from 'react-router-dom'

interface propType{
    label : string,
    buttontext : string,
    to :string
}

function BottomWarning({label, buttontext, to} : propType){
    return <div className='py-2 text-sm flex justify-center'>
        <div>
            {label}
        </div>
        <Link to={to}>
            {buttontext}
        </Link>
    </div>
}

export default BottomWarning