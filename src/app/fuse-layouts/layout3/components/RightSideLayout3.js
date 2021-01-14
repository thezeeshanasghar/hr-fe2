import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import React,{ useState } from 'react';

function RightSideLayout3() {
	const [count, setCount] = useState(0);
	function onClick(){
		console.log("working")
	}
	return (
		<div>
	
			<QuickPanel onClick={onClick()} />
		</div>
	);
}

export default React.memo(RightSideLayout3);
