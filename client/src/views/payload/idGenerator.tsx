import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { v4 as uuidv4 } from 'uuid';

const useStyle = makeStyles(() => ({
	textInput: {
		padding: '0.5rem',
	},
}));

export default function IdGenerator(props: { setId: any }) {
	const { setId } = props;
	const classes = useStyle();
	const [text, setText] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setText(e.target.value);
	};

	const generateNewId = () => {
		const newId = uuidv4();
		setText(newId);
	};

	const handleSetId = () => {
		setId(text);
	};

	return (
		<div>
			<FormControl className={classes.textInput}>
				<OutlinedInput
					id="standard-adornment-password"
					type={'text'}
					value={text}
					onChange={handleChange}
					autoFocus
					endAdornment={
						<InputAdornment position="end">
							<Button
								color={'primary'}
								variant={'contained'}
								aria-label="toggle password visibility"
								onClick={handleSetId}
							>
								Set
							</Button>
							<Button
								color={'secondary'}
								variant={'contained'}
								aria-label="toggle password visibility"
								onClick={generateNewId}
							>
								Gen
							</Button>
						</InputAdornment>
					}
				/>
			</FormControl>
		</div>
	);
}
