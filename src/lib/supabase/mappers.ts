import type { Product } from '@/types/product';
import type { Activity } from '@/types/activity';

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id:                   row.id as number,
    cameraName:           row.camera_name as string,
    baseSrc:              row.base_src as string,
    slides:               (row.slides as string[]) ?? [],
    buttonSrc:            row.button_src as string,
    infoButtonSrc:        row.info_button_src as string,
    infoButtonMain:       row.info_button_main as string,
    infoButtonSecondary:  row.info_button_secondary as string | undefined,
    infoButtonAmazonUK:   row.info_button_amazon_uk as string | undefined,
    infoButtonAmazonUS:   row.info_button_amazon_us as string | undefined,
    modalDescription:     row.modal_description as string | undefined,
    modalSpecs:           row.modal_specs as Array<{ label: string; value: string }> | undefined,
    modalFeatures:        row.modal_features as string[] | undefined,
    amazonUKLink:         row.amazon_uk_link as string | undefined,
    amazonUSLink:         row.amazon_us_link as string | undefined,
    amazonDELink:         row.amazon_de_link as string | undefined,
    badgeBrand:           row.badge_brand as string | undefined,
    badgeType:            row.badge_type as string | undefined,
    badgePrice:           row.badge_price as string | undefined,
    isNew:                row.is_new as boolean | undefined,
    compatibleCameras:    (row.compatible_cameras as string[]) ?? [],
    compatibleBrands:     (row.compatible_brands as string[]) ?? [],
    budget:               row.budget as 'low' | 'medium' | 'high',
    isWaterproof:         row.is_waterproof as boolean,
    isShockproof:         row.is_shockproof as boolean,
    isCinemaOnly:         row.is_cinema_only as boolean,
    isFastShutterSpeed:   row.is_fast_shutter_speed as boolean,
    hasLens:              row.has_lens as boolean,
    isOptional:           row.is_optional as boolean,
    isKit:                row.is_kit as boolean,
    isDSLR:               row.is_dslr as boolean,
    cameraType:           row.camera_type as 'mirrorless' | 'dslr' | 'both' | undefined,
  };
}

export function mapActivity(row: Record<string, unknown>): Activity {
  return {
    id:                   row.id as number,
    name:                 row.name as string,
    slug:                 row.slug as string,
    imagePath:            row.image_path as string,
    backgroundImagePath:  row.background_image_path as string | undefined,
    initialPosition:      row.initial_position as [number, number, number],
    color:                row.color as string,
    description:          row.description as string | undefined,
  };
}
