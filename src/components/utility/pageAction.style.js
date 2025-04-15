import styled from "styled-components";
import WithDirection from "../../settings/withDirection";

const WDComponentDivAction = styled.div`
  /* text-align: right; */
  display: inline-block;
  /* flex: 1; */
  padding: 0 3px 0 0;
  margin-bottom: 15px;
  width: 100%;
  @media only screen and (max-width: 720px) {
    text-align: left;
    display: block;
    flex: none;
    width: 100%;
    padding: 0 0 10px 0;
  }

  button {
    margin-right: 0px;
    /* margin-left: 10px; */
    @media only screen and (max-width: 1336px) {
      margin-left: 0px;
      margin-right: 10px;
    }
  }
`;

const ComponentDivAction = WithDirection(WDComponentDivAction);
export { ComponentDivAction };
