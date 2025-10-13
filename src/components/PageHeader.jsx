export default function PageHeader({ tittle, children, tittle1, tittle2, tittle3 }) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <h1 className="text-2xl font-bold text-black">{tittle}</h1>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500">{tittle1}</span>
                    <span id="breadcrumb-separator" className="text-gray-500">{tittle2}</span>
                    <span id="breadcrumb-current" className="text-gray-500">{tittle3}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {children}
            </div>
        </div>
    );
}