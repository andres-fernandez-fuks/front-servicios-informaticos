import {
    Button,  
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

import { useEffect } from "react";

import { useState } from "react";
import classNames from "classnames";
import "components/Form/style.css"

export default function MultiTable(props) {
    const [category, setCategory] = useState(props.tables.length ? props.buttons[0] : null);
    const [activeTableIndex, setActiveTableIndex] = useState(0);

    useEffect(() => {
        if (props.tables.length) {
            var table_index = props.buttons.indexOf(category);
            setActiveTableIndex(table_index);
        }
    } , [category]);

    function renderButtonGroup() {
        return (
            props.buttons.map((button_name, index) => {
                return (
                    <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                            active: category === button_name,
                        })}
                        onClick={(e) => setCategory(button_name)}
                        >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label={button_name}>
                            {button_name}
                        </span>
                        <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                        </span>
                    </Button>
                )
            })

        )
    }

    function renderButtons() {
        return (
            <Row>
                <Col md="6">
                    <h4><left><b>{category}</b></left></h4>
                </Col>
                <Col md="6">
                    <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                    >
                        {renderButtonGroup()}
                    </ButtonGroup>
                </Col>
            </Row>
        )
    }

    function renderTable() {
        if (!props.tables.length) return <></>;
        var table_component = props.tables[activeTableIndex]
        return (
            <>
                <div>
                    {table_component}
                </div>
            </>
        )
    }

    return (
        <Card className="multi-table-card">
            <CardHeader>
                {renderButtons()}
            </CardHeader>
            <CardBody>
                {renderTable()}
            </CardBody>
        </Card>
    )
}