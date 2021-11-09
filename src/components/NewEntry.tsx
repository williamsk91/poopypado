import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "./theme";

import styled from "styled-components/native";

import { Card } from "./Card";
import { PillButton } from "./PillButton";
import { Spacer } from "./Spacer";
import { CalTypeSelection } from "./CalTypeSelection";
import { FontText } from "./FontText";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  onNewEntryPress: () => void;
}

export const typeDescription = [
  "Click on a Type Button or a date with an existing entry for more information",
  "Small, hard, separate lumps",
  "Sausage-shaped and lumpy",
  "Sausage-shaped with cracks over the surface",
  "Smooth and soft, Sausage-shaped",
  "Small and soft blobs with defined edges",
  "Fluffy/mushy pieces with ragged edges",
  "Watery consistency with no solid pieces",
];

export const NewEntry = (props: Props) => {
  const { onNewEntryPress } = props;
  const [typeSelected, setType] = useState(0);

  return (
    <Container>
      <CalTypeSelection typeSelected={typeSelected} onSelect={setType} />
      <InstructionContainer>
        <Intruction>
          <FontText weight={500}>{typeDescription[typeSelected]}</FontText>
        </Intruction>
      </InstructionContainer>
      <Spacer size="9" />
      <EntryInfo>
        <Numerator>
          <FontText weight={500}>37</FontText>
        </Numerator>
        <Denomenator>
          <FontText weight={500}>Entries in the Last 30 Days</FontText>
        </Denomenator>
      </EntryInfo>
      <ButtContainer>
        <TouchableOpacity onPress={onNewEntryPress}>
          <AntDesign name="pluscircle" size={80} color={theme.color.main} />
        </TouchableOpacity>
      </ButtContainer>
    </Container>
  );
};

const InstructionContainer = styled.View`
  height: 65px;
  width: 100%;
  padding: 8px 10px;
`;

const EntryInfo = styled.View`
  position: absolute;
  bottom: 18px;
  left: 15px;
  width: 100px;
`;
const Numerator = styled.Text`
  font-size: 65px;
  color: ${(p) => p.theme.color.icon};
`;
const Denomenator = styled.Text`
  font-size: 16px;
  color: ${(p) => p.theme.color.icon};
`;

const ButtContainer = styled.View`
  position: absolute;
  bottom: 47px;
  right: 15px;
`;

const Container = styled.View`
  flex: 1;
  display: flex;
  margin: 12px 15px;
`;

const Intruction = styled.Text`
  font-size: 14px;
  text-align: left;
  color: #9f9f9f;
`;
