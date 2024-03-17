interface propType{
    label : string
}

function Heading({label} : propType){
    return <div className="font-bold text-4xl pt-6">
        {label}
    </div>
}

export default Heading