import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import { Fragment } from "react";

function ProductFilter({filters, handleFilter}) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrafold ">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map(keyItem => <Fragment key={keyItem}>
                        <div>
                            <h3 className="text-base font-bold">{keyItem}</h3>
                            <div className="grid gap-2 mt-2">
                                {
                                    filterOptions[keyItem].map(option => <Label key={option.id} className='font-medium flex items-center gap-2 '>
                                        <Checkbox checked={filters && Object.keys(filters).length > 0 
                                            && filters[keyItem] && filters[keyItem].indexOf(option.id) > -1

                                        } onCheckedChange={()=>handleFilter(keyItem, option.id)} className='border-gray-500'/>
                                            {option.label}
                                    </Label>

                                    )
                                }
                            </div>
                        </div>
                        <Separator/>
                    </Fragment>)
                }
            </div>
        </div>
    );
}

export default ProductFilter;