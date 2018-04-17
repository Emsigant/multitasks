import React, { Component } from "react";
import { Input, Icon } from "antd";

/**
 * props: type
 * prefixType: string
 * holder: string
 * change: function
 * inputValue: number | string
 * target: string
 * touched: boolean
 * type: string, default set to 'text'
 */
class WrappedInput extends Component {
	render() {
		let { prefixType, holder, change, inputValue, target, touched, type = 'text', width = '270px' } = this.props;
		let msg = `请输入${holder}`;
		let showWarning = inputValue === '' && touched;
		return (
			<div className='wrapped-input'>
				<Input
					prefix={<Icon type={prefixType} />}
					placeholder={holder}
					data-target={target}
					onChange={change}
					value={inputValue}
					style={{ width }}
					type={type}
				/>
				{
					showWarning ?
						<span className="warning-span">{msg}</span> :
						null
				}
			</div>
		)
	}
};

export default WrappedInput;