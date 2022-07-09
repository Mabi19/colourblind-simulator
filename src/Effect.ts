import imgNone from "./assets/none.png";
import imgProtanopia from "./assets/protanopia.png";
import imgDeuteranopia from "./assets/deuteranopia.png";
import imgTritanopia from "./assets/tritanopia.png";
import imgAchromatopsia from "./assets/achromatopsia.png";

export enum Effect {
    None,
    Protanopia,
    Deuteranopia,
    Tritanopia,
    Achromatopsia,
}

export const effectNames: Record<Effect, string> = {
    [Effect.None]: "Brak",
    [Effect.Protanopia]: "Protanopia",
    [Effect.Deuteranopia]: "Deuteranopia",
    [Effect.Tritanopia]: "Tritanopia",
    [Effect.Achromatopsia]: "Achromatopsja",
}

export const effectImages: Record<Effect, string> = {
    [Effect.None]: imgNone,
    [Effect.Protanopia]: imgProtanopia,
    [Effect.Deuteranopia]: imgDeuteranopia,
    [Effect.Tritanopia]: imgTritanopia,
    [Effect.Achromatopsia]: imgAchromatopsia,
}

// Source: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
export const effectMatrices: Record<Effect, Float32Array> = {
    [Effect.None]: new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]), // identity
    [Effect.Protanopia]: new Float32Array([0.203876, 0.990338, -0.194214, 0.112975, 0.794542, 0.092483, -0.005222, -0.041043, 1.046265]),
    [Effect.Deuteranopia]: new Float32Array([0.392952, 0.823610, -0.216562, 0.263559, 0.690210, 0.046232, -0.011910, 0.040281, 0.971630]),
    [Effect.Tritanopia]: new Float32Array([1.278864, -0.125333, -0.153531, -0.084748, 0.957674, 0.127074, -0.000989, 0.601151, 0.399838]),
    [Effect.Achromatopsia]: new Float32Array([0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722]),
}