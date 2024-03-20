
interface PropType {
    label: string;
    placeholder: string;
    onChange: () => void; // Renamed to avoid naming conflict
}

function Inputbox({ label, placeholder, onChange }: PropType) {
    return (
        <div>
           <div className="text-sm font-medium text-left py-2">
            {label}
           </div>
           <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200"/>
        </div>
    );
}

export default Inputbox;
