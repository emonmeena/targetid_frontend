import React from "react";
import {
  Form,
  FormControl,
  Button,
  Table,
  Accordion,
  Card,
  ListGroup,
  Container,
} from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";

const SearchBox = () => {
  const [data, setData] = useState([]);
  const [filtersArray, setFilterArray] = useState([]);
  const [query, setQuery] = useState("Acute myeloid leukemia");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchData = async () => {
    const response = await axios.get(
      "http://emonmeena23.pythonanywhere.com/api/get_all_disease/" + query
    );
    let array =[]
    setData(response.data);

    for (let item of response.data.drugs_for_disease) {
      if (!array.includes(item.ClinicalStatus)) {
        array.push(item.ClinicalStatus);
      }
    }
    setFilterArray(array)
    setSelectedFilter("All")
  };

  const showTargets = () => {
    if (data.length === 0) return <></>;

    let targets = data.targets_for_disease;
    return (
      <>
        {targets.map((target_name, key) => (
          <p key={key}>{target_name.TargetName}</p>
        ))}
      </>
    );
  };

  function NestedAccordion2(drugs) {
    if (!drugs) return <></>;
    // let drugs = [{'a': [1,2,3], 'b': '123', 'c': '2345'}, {'a': [4,5,6], 'b': '456', 'c': '567'}]
    // console.log("wow", drug)
    return (
      <ListGroup>
        {drugs.map((drug, key) => {
          return (
            <ListGroup.Item key={key}>
              <div>
                <p>{drug.TargetName}</p>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  }

  function NestedAccordion(drugs) {
    if (!drugs) return <></>;
    // let drugs = [{'a': [1,2,3], 'b': '123', 'c': '2345'}, {'a': [4,5,6], 'b': '456', 'c': '567'}]
    // console.log("wow", drug)
    console.log(filtersArray);

    return (
      <Accordion defaultActiveKey="0">
        {drugs.map((drug, key) => {
          if(drug.ClinicalStatus === selectedFilter || selectedFilter === "All") 
          return (
            <div key={key}>
              <Accordion.Item eventKey={key.toString()}>
                <Accordion.Header className="fs-1">
                  {drug.DrugName}
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <p>{drug.ClinicalStatus}</p>
                  </div>
                  <div>
                    <p>{drug.DrugSMIL}</p>
                  </div>
                  <div>
                    {drug.targets_for_drug.length === 0 ? (
                      <></>
                    ) : (
                      <ListGroup>
                        {drug.targets_for_drug.map((target, key2) => {
                          return (
                            <ListGroup.Item key={key2}>
                              {target.TargetName}
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          );
        })}
      </Accordion>
    );
  }

  const showFilters = () => {
    return (
      <>
        <Form.Select aria-label="Default select example" onChange={(e)=>{setSelectedFilter(e.target.value)}}>
          <option>All</option>
          {filtersArray.map((filterName, key) => {
            return (
          <option value={filterName} key={key}>{filterName}</option>
            )
          })}
        </Form.Select>
      </>
    );
  };

  return (
    <Container>
      <Form className="mt-5">
        <div>
          <FormControl
            type="text"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Button variant="outline-info" onClick={() => fetchData()}>
            Search
          </Button>
        </div>
      </Form>
      <div>
        <div>{showFilters()}</div>
        <div>
          <p>{data.DiseaseName}</p>
        </div>
        <div>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Targets</Accordion.Header>
                <Accordion.Body>
                  {NestedAccordion2(data.targets_for_disease)}
                </Accordion.Body>
              </Accordion.Item>
            </Card>

            <Card>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Drugs</Accordion.Header>
                <Accordion.Body>
                  {NestedAccordion(data.drugs_for_disease)}
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          </Accordion>
        </div>
      </div>
    </Container>
  );
};

export default SearchBox;
