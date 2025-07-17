import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({currentEditedId, imageFile, formControls, formData, setFormData, onSubmit, buttonText }) {
    function renderInputsByComponentType(getControlItem) {

        let element = null;
        const value = formData[getControlItem.name] || ''

        switch (getControlItem.componentType) {
            case 'input':
                element = (<Input
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    id={getControlItem.name}
                    type={getControlItem.type}
                    value={value}
                    onChange={event => setFormData({
                        ...formData,
                        [getControlItem.name]: event.target.value
                    })}
                    required
                    minLength={2}
                />)
                break;

            case 'select':
                element = (
                    <div>
                        <Select required onValueChange={value => setFormData({
                            ...formData,
                            [getControlItem.name]: value
                        })} value={value}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder={getControlItem.label} />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    getControlItem.options &&
                                        getControlItem.options.length > 0 ?
                                        getControlItem.options.map(optionItem => <SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>) : null
                                }
                            </SelectContent>
                        </Select>
                        <input
                            type="text"
                            value={value}
                            onChange={() => { }}
                            required
                            className="hidden"
                            
                        />
                    </div>

                )
                break;

            case 'textarea':
                element = (
                    <Textarea required minLength={3}
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.id}
                        value={value}
                        onChange={event => setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })}
                    />
                )
                break;

            default:
                element = (<Input required minLength={2}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    id={getControlItem.name}
                    type={getControlItem.type}
                    value={value}
                    onChange={event => setFormData({
                        ...formData,
                        [getControlItem.name]: event.target.value
                    })}
                />)
                break;
        }
        return element
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3 ">
                {
                    formControls.map(controlItem => <div key={controlItem.name} className="grid w-full gap-1.5 ">
                        <Label className="mb-1">{controlItem.label}</Label>
                        {
                            renderInputsByComponentType(controlItem)
                        }
                    </div>)
                }
            </div>
            {
                imageFile !== null || currentEditedId !== null ? <Button className='mt-2 w-full bg-orange-600' type='sumbit'>{buttonText || 'Submit'}</Button>
                    : <Button disabled={true} className='mt-2 w-full' type='sumbit'>{buttonText || 'Submit'}</Button>
            }

        </form>
    );
}

export default CommonForm;