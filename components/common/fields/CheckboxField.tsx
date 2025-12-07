import { ComponentPropsWithoutRef } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

import { Checkbox } from "../../ui/checkbox"
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage
} from "../../ui/form"

interface CheckBoxFieldProps<
	TFieldValue extends FieldValues,
	TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"input"> {
	label?: string
	field: ControllerRenderProps<TFieldValue, TName>
	description?: string
	icon?: React.ReactNode
	onChangeCustomize?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckBoxField = <
	TFieldValue extends FieldValues,
	TName extends Path<TFieldValue>
>({
	label,
	field,
	description
}: CheckBoxFieldProps<TFieldValue, TName>) => {
	return (
		<FormItem>
			<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
				<FormControl>
					<Checkbox checked={field.value} onCheckedChange={field.onChange} />
				</FormControl>
				<div className="space-y-1 leading-none">
					{label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
					{description && <FormDescription>{description}</FormDescription>}
				</div>
			</FormItem>
			<FormMessage />
		</FormItem>
	)
}

export default CheckBoxField
