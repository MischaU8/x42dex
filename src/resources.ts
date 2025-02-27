import { ImageSource, ImageWrapping, Loader } from "excalibur";

export const Resources = {
  // https://opengameart.org/content/space-parallax-background
  Parallax60: new ImageSource('./images/backgrounds/Parallax60.png', {
    wrapping: ImageWrapping.Repeat
  }),
  Parallax80: new ImageSource('./images/backgrounds/Parallax80.png', {
    wrapping: ImageWrapping.Repeat
  }),
  Parallax100: new ImageSource('./images/backgrounds/Parallax100.png', {
    wrapping: ImageWrapping.Repeat
  }),
  BackdropBlackLittleSparkBlack: new ImageSource('./images/backgrounds/BackdropBlackLittleSparkBlack.png', {
    wrapping: ImageWrapping.Repeat
  }),
  BackdropBlackLittleSparkTransparent: new ImageSource('./images/backgrounds/BackdropBlackLittleSparkTransparent.png', {
    wrapping: ImageWrapping.Repeat
  }),
  AstroidA: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_detailedLarge.png'),
  AstroidB: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_detailedSmall.png'),
  AstroidC: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_large.png'),
  AstroidD: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_small.png'),
  AstroidE: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_squareDetailedLarge.png'),
  AstroidF: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_squareDetailedSmall.png'),
  AstroidG: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_squareLarge.png'),
  AstroidH: new ImageSource('./images/kenney_simple-space/PNG/Default/meteor_squareSmall.png'),
  EnemyA: new ImageSource('./images/kenney_simple-space/PNG/Default/enemy_A.png'),
  EnemyB: new ImageSource('./images/kenney_simple-space/PNG/Default/enemy_B.png'),
  EnemyC: new ImageSource('./images/kenney_simple-space/PNG/Default/enemy_C.png'),
  EnemyD: new ImageSource('./images/kenney_simple-space/PNG/Default/enemy_D.png'),
  EnemyE: new ImageSource('./images/kenney_simple-space/PNG/Default/enemy_E.png'),
  SatelliteA: new ImageSource('./images/kenney_simple-space/PNG/Default/satellite_A.png'),
  SatelliteB: new ImageSource('./images/kenney_simple-space/PNG/Default/satellite_B.png'),
  SatelliteC: new ImageSource('./images/kenney_simple-space/PNG/Default/satellite_C.png'),
  SatelliteD: new ImageSource('./images/kenney_simple-space/PNG/Default/satellite_D.png'),
  ShipA: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_A.png'),
  ShipB: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_B.png'),
  ShipC: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_C.png'),
  ShipD: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_D.png'),
  ShipE: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_E.png'),
  ShipF: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_F.png'),
  ShipG: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_G.png'),
  ShipH: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_H.png'),
  ShipI: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_I.png'),
  ShipJ: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_J.png'),
  ShipK: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_K.png'),
  ShipL: new ImageSource('./images/kenney_simple-space/PNG/Default/ship_L.png'),
  StationA: new ImageSource('./images/kenney_simple-space/PNG/Default/station_A.png'),
  StationB: new ImageSource('./images/kenney_simple-space/PNG/Default/station_B.png'),
  StationC: new ImageSource('./images/kenney_simple-space/PNG/Default/station_C.png'),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
