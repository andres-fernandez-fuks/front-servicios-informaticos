import {Input} from "reactstrap";

export const DisabledInput = (props) => {
    return <Input style={{color: "#999999"}} disabled={true} {...props} />;
}