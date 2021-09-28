// WWCompression.js
// Westwood压缩算法
// By Heli 2021.9.22

// 改编自EA的Westwood压缩: 
//  https://github.com/electronicarts/CnC_Remastered_Collection/blob/7d496e8a633a8bbf8a14b65f490b4d21fa32ca03/CnCTDRAMapEditor/Utility/WWCompression.cs

wwCompression = new function() {
    const XOR_SMALL = 0x7F;
    const XOR_MED = 0xFF;
    const XOR_LARGE = 0x3FFF;
    const XOR_MAX = 0x7FFF;
    const UINT16_MAX = 0xFFFF;

    this.LCWWorstCase = (datasize) => {
        return datasize + (datasize / 63) + 1;
    }

    this.XORWorstCase = (datasize) => {
        return datasize + ((datasize / 63) * 3) + 4;
    }

    this.LCWCompress = (input) => {
        // empty input
        if (!input || input.length == 0) {
            return new Array(0);
        }
        // init
        let relative = input.length > UINT16_MAX;
        let getp = 0;
        let putp = 0;
        let getend = input.length;
        let worstcase = Math.max(10000, getend * 2);
        let output = new Array(worstcase);
        if (relative) {
            output[putp++] = 0;
        }
        let cmd_onep = putp;
        output[putp++] = 0x81;
        output[putp++] = input[getp++];
        let cmd_one = true;
        // compress
        while (getp < getend) {
            if (((getend - getp) > 64) && (input[getp] == input[getp + 64])) {
                let rlemax = (getend - getp) < UINT16_MAX ? getend : getp + UINT16_MAX;
                let rlep = getp + 1;
                while (rlep < rlemax && input[rlep] == input[getp]) {
                    rlep++;
                }
                let run_length = (UInt16)(rlep - getp);
                if (run_length >= 0x41) {
                    cmd_one = false;
                    output[putp++] = 0xFE;
                    output[putp++] = run_length & 0xFF;
                    output[putp++] = (run_length >> 8) & 0xFF;
                    output[putp++] = input[getp];
                    getp = rlep;
                    continue;
                }
            }
            let block_size = 0;
            let offstart = relative ? getp < UINT16_MAX ? 0 : getp - UINT16_MAX : 0;
            let offchk = offstart;
            let offsetp = getp;
            while (offchk < getp)
            {
                while ((offchk < getp) && (input[offchk] != input[getp])) {
                    offchk++;
                }
                if (offchk >= getp) {
                    break;
                }
                let i;
                for (i = 1; (getp + i) < getend; i++) {
                    if (input[offchk + i] != input[getp + i]) {
                        break;
                    }
                }
                if (i >= block_size) {
                    block_size = i;
                    offsetp = offchk;
                }
                offchk++;
            }
            if (block_size <= 2) {
                if (cmd_one && (output[cmd_onep] < 0xBF)) {
                    output[cmd_onep]++;
                    output[putp++] = input[getp++];
                } else {
                    cmd_onep = putp;
                    output[putp++] = 0x81;
                    output[putp++] = input[getp++];
                    cmd_one = true;
                }
            } else {
                let offset;
                let rel_offset = getp - offsetp;
                if (block_size > 0xA || ((rel_offset) > 0xFFF)) {
                    if (block_size > 0x40) {
                        output[putp++] = 0xFF;
                        output[putp++] = block_size & 0xFF;
                        output[putp++] = (block_size >> 8) & 0xFF;
                    } else {
                        output[putp++] = (block_size - 3) | 0xC0;
                    }
                    offset = relative ? rel_offset : offsetp;
                } else {
                    offset = rel_offset << 8 | (16 * (block_size - 3) + (rel_offset >> 8));
                }
                output[putp++] = offset & 0xFF;
                output[putp++] = (offset >> 8) & 0xFF;
                getp += block_size;
                cmd_one = false;
            }
        }
        // Output
        output[putp++] = 0x80;
        return Array.from(output);
    }

    this.LCWDecompress = (input, readOffset, output, readEnd) => {
        // empty input
        if (!input || input.length == 0 || !output || output.length == 0) {
            return 0;
        }
        // init
        let relative = false;
        let writeOffset = 0;
        let writeEnd = output.length;
        if (readEnd <= 0) {
            readEnd = input.length;
        }
        if (readOffset >= readEnd) {
            return writeOffset;
        }
        if (input[readOffset] == 0) {
            relative = true;
            readOffset++;
        }
        // decompress
        while (writeOffset < writeEnd) {
            if (readOffset >= readEnd) {
                return writeOffset;
            }
            let flag = input[readOffset++];
            let cpysize;
            let offset;
            if ((flag & 0x80) != 0) {
                if ((flag & 0x40) != 0) {
                    cpysize = (flag & 0x3F) + 3;
                    if (flag == 0xFE) {
                        if (readOffset >= readEnd) {
                            return writeOffset;
                        }
                        cpysize = input[readOffset++];
                        if (readOffset >= readEnd) {
                            return writeOffset;
                        }
                        cpysize += (input[readOffset++]) << 8;
                        if (cpysize > writeEnd - writeOffset) {
                            cpysize = writeEnd - writeOffset;
                        }
                        if (readOffset >= readEnd) {
                            return writeOffset;
                        }
                        for (; cpysize > 0; cpysize--) {
                            if (writeOffset >= writeEnd) {
                                return writeOffset;
                            }
                            output[writeOffset++] = input[readOffset];
                        }
                        readOffset++;
                    } else {
                        let s;
                        if (flag == 0xFF) {
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            cpysize = input[readOffset++];
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            cpysize += (input[readOffset++]) << 8;
                            if (cpysize > writeEnd - writeOffset) {
                                cpysize = writeEnd - writeOffset;
                            }
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            offset = input[readOffset++];
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            offset += (input[readOffset++]) << 8;
                            if (relative) {
                                s = writeOffset - offset;
                            } else {
                                s = offset;
                            }
                            for (; cpysize > 0; cpysize--) {
                                if (writeOffset >= writeEnd) {
                                    return writeOffset;
                                }
                                output[writeOffset++] = output[s++];
                            }
                        } else {
                            if (cpysize > writeEnd - writeOffset) {
                                cpysize = writeEnd - writeOffset;
                            }
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            offset = input[readOffset++];
                            if (readOffset >= readEnd) {
                                return writeOffset;
                            }
                            offset += (input[readOffset++]) << 8;
                            if (relative) {
                                s = writeOffset - offset;
                            } else {
                                s = offset;
                            }
                            for (; cpysize > 0; cpysize--) {
                                if (writeOffset >= writeEnd) {
                                    return writeOffset;
                                }
                                output[writeOffset++] = output[s++];
                            }
                        }
                    }
                } else {
                    if (flag == 0x80) {
                        return writeOffset;
                    }
                    cpysize = flag & 0x3F;
                    if (cpysize > (writeEnd - writeOffset)) {
                        cpysize = writeEnd - writeOffset;
                    }
                    for (; cpysize > 0; cpysize--) {
                        if ((readOffset >= readEnd) || (writeOffset >= writeEnd)) {
                            return writeOffset;
                        }
                        output[writeOffset++] = input[readOffset++];
                    }
                }
            } else {
                cpysize = (flag >> 4) + 3;
                if (cpysize > (writeEnd - writeOffset)) {
                    cpysize = writeEnd - writeOffset;
                }
                if (readOffset >= readEnd) {
                    return writeOffset;
                }
                offset = ((flag & 0xF) << 8) + input[readOffset++];
                for (; cpysize > 0; cpysize--)
                {
                    if ((writeOffset >= writeEnd) || (writeOffset < offset)) {
                        return writeOffset;
                    }
                    output[writeOffset] = output[writeOffset - offset];
                    writeOffset++;
                }
            }
        }
        if ((writeOffset == writeEnd) && (readOffset < input.length) && (input[readOffset] == 0x80)) {
            readOffset++;
        }
        return writeOffset;
    }

    this.GenerateXorDelta = (source, base) => {
        let putp = 0;
        let getsp = 0;
        let getbp = 0;
        let getsendp = Math.min(source.length, base.length);
        let dest = new Array(this.XORWorstCase(getsendp));

        while (getsp < getsendp) {
            let fillcount = 0;
            let xorcount = 0;
            let skipcount = 0;
            let lastxor = source[getsp] ^ base[getbp];
            let testsp = getsp;
            let testbp = getbp;

            while ((testsp < getsendp) && (source[testsp] != base[testbp])) {
                if ((source[testsp] ^  base[testbp]) == lastxor) {
                    fillcount++;
                    xorcount++;
                } else {
                    if (fillcount > 3) {
                        break;
                    }
                    lastxor = source[testsp] ^ base[testbp];
                    fillcount = 1;
                    xorcount++;
                }
                testsp++;
                testbp++;
            }
            fillcount = fillcount > 3 ? fillcount : 0;
            xorcount -= fillcount;
            while (xorcount != 0) {
                let count;
                if (xorcount < XOR_MED) {
                    count = (xorcount <= XOR_SMALL) ? xorcount : XOR_SMALL;
                    dest[putp++] = count;
                } else {
                    count = (xorcount <= XOR_LARGE) ? xorcount : XOR_LARGE;
                    dest[putp++] = 0x80;
                    dest[putp++] = count & 0xFF;
                    dest[putp++] = ((count >> 8) & 0xFF) | 0x80;
                }
                while (count != 0) {
                    dest[putp++] = source[getsp++] ^ base[getbp++];
                    count--;
                    xorcount--;
                }
            }
            while (fillcount != 0) {
                let count;
                if (fillcount <= XOR_MED) {
                    count = fillcount;
                    dest[putp++] = 0;
                    dest[putp++] = count & 0xFF;
                } else {
                    count = (fillcount <= XOR_LARGE) ? fillcount : XOR_LARGE;
                    dest[putp++] = 0x80;
                    dest[putp++] = count & 0xFF;
                    dest[putp++] = ((count >> 8) & 0xFF) | 0xC0;
                }
                dest[putp++] = source[getsp] ^ base[getbp];
                fillcount -= count;
                getsp += count;
                getbp += count;
            }
            while ((testsp < getsendp) && (source[testsp] == base[testbp])) {
                skipcount++;
                testsp++;
                testbp++;
            }

            while (skipcount != 0) {
                let count;
                if (skipcount < XOR_MED) {
                    count = (skipcount <= XOR_SMALL) ? skipcount : XOR_SMALL;
                    dest[putp++] = count | 0x80;
                } else {
                    count = (skipcount <= XOR_MAX) ? skipcount : XOR_MAX;
                    dest[putp++] = 0x80;
                    dest[putp++] = count & 0xFF;
                    dest[putp++] = (count >> 8) & 0xFF;
                }
                skipcount -= count;
                getsp += count;
                getbp += count;
            }
        }
        dest[putp++] = 0x80;
        dest[putp++] = 0;
        dest[putp++] = 0;
        return Array.from(dest);
    }

    this.ApplyXorDelta = (data, xorSource, xorStart, xorEnd) => {
        let putp = 0;
        let value = 0;
        let dataEnd = data.length;
        if (xorEnd <= 0) {
            xorEnd = xorSource.length;
        }
        while ((putp < dataEnd) && (xorStart < xorEnd)) {
            let cmd = xorSource[xorStart++];
            let count = cmd;
            let xorval = false;
            if ((cmd & 0x80) == 0) {
                if (cmd == 0) {
                    if (xorStart >= xorEnd) {
                        return;
                    }
                    count = xorSource[xorStart++] & 0xFF;
                    if (xorStart >= xorEnd) {
                        return;
                    }
                    value = xorSource[xorStart++];
                    xorval = true;
                }
            } else {
                count &= 0x7F;
                if (count != 0) {
                    putp += count;
                    continue;
                }
                if (xorStart >= xorEnd) {
                    return;
                }
                count = xorSource[xorStart++] & 0xFF;
                if (xorStart >= xorEnd) {
                    return;
                }
                count += xorSource[xorStart++] << 8;
                if (count == 0) {
                    return;
                }
                if ((count & 0x8000) == 0) {
                    putp += count;
                    continue;
                }
                if ((count & 0x4000) != 0) {
                    count &= 0x3FFF;
                    if (xorStart >= xorEnd) {
                        return;
                    }
                    value = xorSource[xorStart++];
                    xorval = true;
                } else {
                    count &= 0x3FFF;
                }
            }
            if (xorval) {
                for (; count > 0; count--) {
                    if (putp >= dataEnd) {
                        return; 
                    }
                    data[putp++] ^= value;
                }
            } else {
                for (; count > 0; count--) {
                    if ((putp >= dataEnd) || (xorStart >= xorEnd)) {
                        return;
                    }
                    data[putp++] ^= xorSource[xorStart++];
                }
            }
        }

    }
}

if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = wwCompression;
}